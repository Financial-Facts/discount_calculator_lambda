import Discount from "@/resources/entities/discount/IDiscount";
import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import HttpException from "@/utils/exceptions/HttpException";
import { discountService, statementService, stickerPriceService } from "../../../../bootstrap";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import getLatestStatements from "../Parser/Parser";


class DiscountManager {

    private apiEnabled = false;
    private existingDiscountCikSet: Set<string>;

    constructor() {
        this.apiEnabled = process.env['enable.api']
            ? process.env['enable.api'].toLowerCase() === 'true'
            : false;
        this.existingDiscountCikSet = new Set<string>();
        this.loadExistingDiscountCikSet();
    }

    public async intiateDiscountCheck(cik: string): Promise<void> {
        try {
            if (this.apiEnabled) {
                await this.checkForDiscount(cik);
            } else {
                await this.checkForNewFilings(cik).then(() => this.checkForDiscount(cik));
            }
        } catch (err: any) {
            if ((err instanceof DisqualifyingDataException || 
                err instanceof InsufficientDataException) &&
                this.existingDiscountCikSet.has(cik)) {
                this.deleteDiscount(cik, err.message);
            }
            console.log(`Error occurred while checking ${cik} for discount: ${err.message}`);
        }
    }

    private async checkForNewFilings(cik: string): Promise<void> {
        return getLatestStatements(cik.slice(3))
            .then(async statements => {
                console.log(`Latest statements recieved for ${cik}`);
                return statementService.saveStatements(cik, statements).then(status => {
                    console.log(`Statements saved for ${cik} with status: ${status}`)
                })
            })
    }

    private async checkForDiscount(cik: string): Promise<void> {
        console.log("In price check consumer checking for a discount on CIK: " + cik);
        return stickerPriceService.checkForSale(cik)
            .then(async (discount: Discount) => {
                return this.saveDiscount(discount); 
            });
    }

    private async saveDiscount(discount: Discount): Promise<void> {
        const cik = discount.cik;
        return discountService.save(discount)
            .then(response => {
                if (response) {
                    console.log("Sticker price sale saved for cik: " + cik);
                    this.existingDiscountCikSet.add(discount.cik);
                }
            }).catch((err: HttpException) => {
                console.log("Sticker price save failed for cik: " + cik + " with err: " + err);
            });
    }

    private async deleteDiscount(cik: string, reason: string): Promise<void> {
        return discountService.delete(cik)
            .then(() => {
                console.log(`Discount for ${cik} has been deleted due to: ${reason}`);
                this.existingDiscountCikSet.delete(cik);
            }).catch((deleteEx: HttpException) => {
                if (deleteEx.status !== 404) {
                    console.log(`Deleting discount for ${cik} failed due to: ${deleteEx.message}`);
                } else {
                    console.log(`Discount for ${cik} does not exist`);
                }
            })
    }

    private async loadExistingDiscountCikSet(): Promise<void> {
        return discountService.getBulkSimpleDiscounts()
            .then(async simpleDiscounts => {
                simpleDiscounts.forEach(simpleDiscount => {
                    this.existingDiscountCikSet.add(simpleDiscount.cik);
                });
                console.log('Existing discount cik successfully loaded!');
            }).catch((err: HttpException) => {
                console.log(`Error occurred while initializing existing discount set: ${err.message}`);
            });
    }
}

export default DiscountManager;
