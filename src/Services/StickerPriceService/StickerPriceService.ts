import Discount from "@/resources/entities/discount/IDiscount";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import factsService from "@/resources/services/facts-service/FactsService";
import historicalPriceService from "../HistoricalPriceService/HistoricalPriceService";
import StickerPriceService from "./IStickerPriceService";
import Calculator from "./helpers/calculator/calculator";

const calculator = new Calculator();

const stickerPriceService: StickerPriceService = {

    checkForSale: (cik: string): Promise<Discount> => {
        return getStickerPriceDiscount(cik)
        .then(async (discount: Discount) => {
            return historicalPriceService.getCurrentPrice(discount.symbol)
                .then(async (price: number) => {
                    if (salePriceExceedsZero(discount) && 
                        anySalePriceExceedsValue(price, discount)) {
                            discount.active = true;
                    }
                    return discount;
                });
        });
    }
}

async function getStickerPriceDiscount(cik: string): Promise<Discount> {
    console.log("In sticker price service getting discount data for cik: " + cik);
    return factsService.getStickerPriceData(cik)
        .then(async (data: StickerPriceData) => {
            return calculator.calculateStickerPriceData(data);
        });
}

function salePriceExceedsZero(discount: Discount): boolean {
    return discount.ttmPriceData.salePrice > 0 &&
            discount.tfyPriceData.salePrice > 0 &&
            discount.ttyPriceData.salePrice > 0;
}

function anySalePriceExceedsValue(value: number, discount: Discount): boolean {
    return discount.ttmPriceData.salePrice > value ||
            discount.tfyPriceData.salePrice > value || 
            discount.ttyPriceData.salePrice > value;
}

export default stickerPriceService;