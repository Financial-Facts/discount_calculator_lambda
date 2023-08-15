import HistoricalPriceService from "../HistoricalPriceService/HistoricalPriceService";
import Calculator from "./helpers/calculator/calculator";
import Discount from "@/resources/entities/discount/IDiscount";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import factsService from "@/resources/services/facts-service/FactsService";
import historicalPriceService from "../HistoricalPriceService/HistoricalPriceService";

class StickerPriceService {

    private calculator: Calculator;

    constructor() {
        this.calculator = new Calculator();
    }

    public async checkForSale(cik: string): Promise<Discount> {
        return this.getStickerPriceDiscount(cik)
            .then(async (discount: Discount) => {
                return historicalPriceService.getCurrentPrice(discount.symbol)
                    .then(async (price: number) => {
                        if (this.salePriceExceedsZero(discount) && 
                            this.anySalePriceExceedsValue(price, discount)) {
                                discount.active = true;
                        }
                        return discount;
                    });
            });
    }

    private async getStickerPriceDiscount(cik: string): Promise<Discount> {
        console.log("In sticker price service getting discount data for cik: " + cik);
        return factsService.getStickerPriceData(cik)
            .then(async (data: StickerPriceData) => {
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
}

export default StickerPriceService;