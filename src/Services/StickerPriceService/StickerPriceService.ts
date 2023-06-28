import FactsService from "@/resources/services/FactsService";
import IdentityService from "@/resources/services/IdentityService";
import HistoricalPriceService from "../HistoricalPriceService/HistoricalPriceService";
import Identity from "@/resources/entities/Identity";
import HistoricalPriceInput from "../HistoricalPriceService/models/HistoricalPriceInput";
import PriceData from "../HistoricalPriceService/models/PriceData";
import { Frequency } from "../HistoricalPriceService/models/Frequency";
import Calculator from "./helpers/calculator/calculator";
import CONSTANTS from "../../Services/ServiceConstants";
import Discount from "@/resources/entities/discount/IDiscount";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

class StickerPriceService {

    private factsService: FactsService;

    constructor() {
        this.factsService = new FactsService();
    }

    public async getStickerPriceDiscount(cik: string): Promise<Discount | null> {
        return this.factsService.getStickerPriceData(cik)
            .then((data: StickerPriceData) => {
                const calculator: Calculator = new Calculator(data);
                return calculator.calculateStickerPriceData();
            });
    }
}

export default StickerPriceService;