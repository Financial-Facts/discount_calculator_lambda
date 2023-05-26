import FactsService from "@/resources/facts/FactsService";
import IdentityService from "@/resources/identity/IdentityService";
import HistoricalPriceService from "../HistoricalPriceService/HistoricalPriceService";
import Identity from "@/resources/identity/models/Identity";
import HistoricalPriceInput from "../HistoricalPriceService/models/HistoricalPriceInput";
import PriceData from "../HistoricalPriceService/models/PriceData";
import { Frequency } from "../HistoricalPriceService/models/Frequency";
import StickerPriceData from "./models/StickerPriceData";

class StickerPriceService {

    private factsService: FactsService;
    private identityService: IdentityService;
    private historicalPriceService: HistoricalPriceService

    constructor() {
        this.factsService = new FactsService();
        this.identityService = new IdentityService;
        this.historicalPriceService = new HistoricalPriceService;
    }

    public async getStickerPrice(cik: string): Promise<number> {
        return this.fetchStickerPriceData(cik)
            .then((data: StickerPriceData) => {
                return 0;
            });
    }

    private async fetchStickerPriceData(cik: string): Promise<StickerPriceData> {
        return Promise.all([this.factsService.getFacts(cik), this.fetchHistoricalPrices(cik)])
            .then((values: [any, PriceData[]]) => {
                return {
                    facts: values[0],
                    h_data: values[1]
                }
            });
    }

    private async fetchHistoricalPrices(cik: string): Promise<PriceData[]> {
        return this.identityService.getIdentityWithCik(cik)
            .then((identity: Identity) => {
                const input: HistoricalPriceInput = this.buildHistoricalPriceInput(identity);
                return this.historicalPriceService.getHistoricalPrices(input)
            });
    }

    private buildHistoricalPriceInput(identity: Identity): HistoricalPriceInput {
        return {
            symbol: identity.symbol,
            fromDate: this.buildFromDate(), // ToDo: extend to 15 year period
            toDate: new Date(),
            frequency: Frequency.DAILY
        }
    }

    private buildFromDate(): Date {
        const date: Date = new Date();
        date.setFullYear(date.getFullYear() - 15);
        return date;
    }

}

export default StickerPriceService;