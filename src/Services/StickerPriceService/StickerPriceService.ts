import FactsService from "@/resources/services/FactsService";
import HistoricalPriceService from "../HistoricalPriceService/HistoricalPriceService";
import Calculator from "./helpers/calculator/calculator";
import Discount from "@/resources/entities/discount/IDiscount";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

class StickerPriceService {

    private factsService: FactsService;
    private calculator: Calculator;
    private historicalPriceService: HistoricalPriceService;

    constructor() {
        this.factsService = new FactsService();
        this.historicalPriceService = new HistoricalPriceService();
        this.calculator = new Calculator(this.historicalPriceService);
    }

    public async checkForSale(cik: string): Promise<Discount | null> {
        return this.getStickerPriceDiscount(cik)
            .then((discount: Discount) => {
                return this.historicalPriceService.getCurrentPrice(discount.symbol)
                    .then((price: number) => {
                        if (this.salePriceExceedsZero(discount) && 
                            this.anySalePriceExceedsValue(price, discount) &&
                            this.annualROICExceedsBenchmark(discount)) {
                                return discount;
                        }
                        return null;
                    })
            })
    }

    private async getStickerPriceDiscount(cik: string): Promise<Discount> {
        console.log("In sticker price service getting discount data for cik: " + cik);
        return this.factsService.getStickerPriceData(cik)
            .then((data: StickerPriceData) => {
                return this.calculator.calculateStickerPriceData(data);
            });
    }

    private salePriceExceedsZero(discount: Discount): boolean {
        return discount.ttmPriceData.salePrice > 0 &&
               discount.tfyPriceData.salePrice > 0 && 
               discount.ttyPriceData.salePrice > 0;
    }

    private anySalePriceExceedsValue(value: number, discount: Discount): boolean {
        return discount.ttmPriceData.salePrice > value ||
               discount.tfyPriceData.salePrice > value || 
               discount.ttyPriceData.salePrice > value;
    }

    private annualROICExceedsBenchmark(discount: Discount): boolean {
        const averageRoicOverPeriod = {
            1: discount.annualROIC.slice(-1)[0].value,
            5: discount.annualROIC.slice(-5).map(year => year.value).reduce((a, b) => a + b)/5,
            10: discount.annualROIC.slice(-10).map(year => year.value).reduce((a, b) => a + b)/10
        }
        return averageRoicOverPeriod[1] > 10 &&
               averageRoicOverPeriod[5] > 10 && 
               averageRoicOverPeriod[10] > 10;
    }
}

export default StickerPriceService;