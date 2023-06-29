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
                    .then((price: any) => {
                        console.log(price);
                        return null;
                    })
            })
    }

    private async getStickerPriceDiscount(cik: string): Promise<Discount> {
        return this.factsService.getStickerPriceData(cik)
            .then((data: StickerPriceData) => {
                return this.calculator.calculateStickerPriceData(data);
            });
    }
}

export default StickerPriceService;