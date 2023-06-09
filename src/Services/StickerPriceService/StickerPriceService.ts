import FactsService from "@/resources/facts/FactsService";
import IdentityService from "@/resources/identity/IdentityService";
import HistoricalPriceService from "../HistoricalPriceService/HistoricalPriceService";
import Identity from "@/resources/identity/models/Identity";
import HistoricalPriceInput from "../HistoricalPriceService/models/HistoricalPriceInput";
import PriceData from "../HistoricalPriceService/models/PriceData";
import { Frequency } from "../HistoricalPriceService/models/Frequency";
import StickerPriceData from "./models/StickerPriceData";
import Calculator from "./helpers/calculator/calculator";
import CONSTANTS from "../../Services/ServiceConstants";
import Discount from "@/resources/discount/IDiscount";
import RetrieverFactory from "./helpers/retriever/retrieverUtils/RetrieverFactory";

class StickerPriceService {

    private factsService: FactsService;
    private identityService: IdentityService;

    constructor() {
        this.factsService = new FactsService();
        this.identityService = new IdentityService();
    }

    public async getStickerPriceDiscount(cik: string): Promise<Discount | null> {
        return this.fetchStickerPriceData(cik)
            .then((data: StickerPriceData) => {
                const calculator: Calculator = new Calculator(
                    data.identity,
                    RetrieverFactory.getRetriever(data.identity.cik, data.facts));
                return calculator.calculateStickerPriceData();
            });
    }

    private async fetchStickerPriceData(cik: string): Promise<StickerPriceData> {
        return Promise.all([this.factsService.getFacts(cik), this.identityService.getIdentityWithCik(cik)])
            .then((values: [any, Identity ]) => {
                return {
                    identity: values[1],
                    facts: values[0]
                }
            });
    }

}

export default StickerPriceService;