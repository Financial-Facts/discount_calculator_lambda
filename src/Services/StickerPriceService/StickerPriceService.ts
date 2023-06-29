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
    private calculator: Calculator;
    private historicalPriceService: HistoricalPriceService;

    constructor() {
        this.factsService = new FactsService();
        this.historicalPriceService = new HistoricalPriceService();
        this.calculator = new Calculator(this.historicalPriceService);
    }

    public async getStickerPriceDiscount(cik: string): Promise<Discount> {
        return this.factsService.getStickerPriceData(cik)
            .then((data: StickerPriceData) => {
                return this.calculator.calculateStickerPriceData(data);
            });
    }
}

export default StickerPriceService;