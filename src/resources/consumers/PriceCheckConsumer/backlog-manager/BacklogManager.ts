import Discount from "@/resources/entities/discount/IDiscount";
import DiscountService from "@/resources/services/DiscountService";
import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import HttpException from "@/utils/exceptions/HttpException";
import StickerPriceService from "Services/StickerPriceService/StickerPriceService";
import DataSource from "datasource";

class BacklogManager {

    private batchCapacity = +(process.env.price_check_consumer_capacity ?? 25);
    private frequency = +(process.env.price_check_consumer_frequency ?? 1);

    private backlog: string[] = [];
    private existingDiscountCik: Set<string> = new Set<string>();

    private discountService: DiscountService;
    private stickerPriceService: StickerPriceService;
    
    constructor(dataSource: DataSource) {
        this.discountService = dataSource.discountService;
        this.stickerPriceService = dataSource.stickerPriceService;
        this.loadExistingDiscountCikSet()
            .then(() => this.watchBacklog());
    }

    public addCikToBacklog(cik: string): void {
        this.backlog.unshift(cik);
    }

    private async watchBacklog(): Promise<void> {
        while(true) {
            await new Promise(f => setTimeout(f, 1000 * this.frequency))
                .then(async () => {
                    if (this.backlog.length > 0) {
                        await this.processBatch();
                    }
                });
        }
    }

    private async processBatch(): Promise<void> {
        const batchCik = this.backlog.splice(0, this.batchCapacity);
        const processing: Record<string, Promise<void>> = {};
        batchCik.forEach(cik => {
            if (!Object.keys(processing).includes(cik)) {
                console.log(`In price check consumer, processing: ${cik}`);
                processing[cik] = this.intiateDiscountCheck(cik);
                this.removeCikFromBacklog(cik);
            }
        });
        console.log(`Awaiting completion of batch: ${batchCik}`)
        await Promise.all(Object.values(processing));
    }

    private async intiateDiscountCheck(cik: string): Promise<void> {
        try {
            await this.checkForDiscount(cik);
        } catch (err: any) {
            if (err instanceof DisqualifyingDataException &&
                this.existingDiscountCik.has(cik)) {
                await this.deleteDiscount(cik, err.message);
            }
            console.log(`Error occurred while checking ${cik} for discount: ${err.message}`);
        }
    }

    private async checkForDiscount(cik: string): Promise<void> {
        console.log("In price check consumer checking for a discount on CIK: " + cik);
        return this.stickerPriceService.checkForSale(cik)
            .then(async (discount: Discount) => {
                return this.saveDiscount(discount); 
            });
    }

    private async saveDiscount(discount: Discount): Promise<void> {
        const cik = discount.cik;
        return this.discountService.save(discount)
            .then(response => {
                if (response) {
                    this.existingDiscountCik.add(cik);
                    console.log("Sticker price sale saved for cik: " + cik);
                }
            }).catch((err: HttpException) => {
                console.log("Sticker price save failed for cik: " + cik + " with err: " + err);
            });
    }

    private async deleteDiscount(cik: string, reason: string): Promise<void> {
        this.discountService.delete(cik)
            .then(() => {
                console.log(`Discount for ${cik} has been deleted due to: ${reason}`);
                this.existingDiscountCik.delete(cik);
            }).catch((deleteEx: HttpException) => {
                if (deleteEx.status !== 404) {
                    console.log(`Deleting discount for ${cik} failed due to: ${deleteEx.message}`);
                } else {
                    console.log(`Discount for ${cik} does not exist`);
                }
            })
    }

    private removeCikFromBacklog(cik: string): void {
        let index = this.backlog.findIndex(value => value === cik);
        while (index !== -1) {
            this.backlog.splice(index, 1);
            index = this.backlog.findIndex(value => value === cik);
        }
    }

    private async loadExistingDiscountCikSet(): Promise<void> {
        return this.discountService.getBulkSimpleDiscounts()
            .then(async simpleDiscounts => {
                simpleDiscounts.forEach(simpleDiscount => {
                    this.existingDiscountCik.add(simpleDiscount.cik);
                });
                console.log('Existing discount cik successfully loaded!');
            }).catch((err: HttpException) => {
                console.log(`Error occurred while initializing existing discount set: ${err.message}`);
            });
    }
}

export default BacklogManager;