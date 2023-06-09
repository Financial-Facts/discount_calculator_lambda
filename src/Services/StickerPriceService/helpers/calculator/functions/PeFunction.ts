import QuarterlyData from "@/resources/discount/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import HistoricalPriceService from "../../../../../Services/HistoricalPriceService/HistoricalPriceService";
import AbstractRetriever from "../../retriever/AbstractRetriever";
import { buildHistoricalPriceInput } from "../../../../../Services/HistoricalPriceService/utils/HistoricalPriceUtils";
import Identity from "@/resources/identity/models/Identity";
import PriceData from "../../../../../Services/HistoricalPriceService/models/PriceData";
import { days_between, median_date } from "../../../../../Services/StickerPriceService/utils/StickerPriceUtils";

class PeFunction extends AbstractFunction {

    private historicalPriceService: HistoricalPriceService;
    private quarterlyEPS: QuarterlyData[];
    private identity: Identity;
    private priceData: PriceData[];

    constructor(identity: Identity, retriever: AbstractRetriever, quarterlyEPS?: QuarterlyData[]) {
        super(retriever);
        this.identity = identity;
        this.historicalPriceService = new HistoricalPriceService();
        this.quarterlyEPS = quarterlyEPS ? quarterlyEPS : [];
        this.priceData = [];
    }

    calculate(): QuarterlyData[] {
        const quarterlyPE: QuarterlyData[] = [];
        this.quarterlyEPS.forEach(quarter => {
            const price = this.priceData.find(day => {
                return days_between(day.date, quarter.announcedDate) <= 3;
            })?.close || 0;
            quarterlyPE.push({
                cik: this.identity.cik,
                announcedDate: quarter.announcedDate,
                value: quarter.value !== 0 ? price/quarter.value : 0
            });
        });
        return quarterlyPE;
    }

    // ToDo: come up with faster way to fetch historical data
    async setVariables(): Promise<void> {
        if (this.quarterlyEPS.length === 0) {
            this.retriever.retrieve_quarterly_EPS().then((fetchedQuarterlyEPS: QuarterlyData[]) => {
                this.quarterlyEPS = fetchedQuarterlyEPS;
            });
        }
        const fromDate: Date = this.quarterlyEPS[0].announcedDate;
        const toDate: Date = this.quarterlyEPS[this.quarterlyEPS.length - 1].announcedDate;
        toDate.setDate(toDate.getDate() + 3);            
        await this.historicalPriceService.getHistoricalPrices(
            buildHistoricalPriceInput(this.identity, fromDate, toDate))
                .then(priceData => {
                    this.priceData = priceData;
                });
        return Promise.resolve();
    }

    setQuarterlyEPS(quarterlyEPS: QuarterlyData[]) {
        this.quarterlyEPS = quarterlyEPS;
    }
    
    annualize(quarterlyPE: QuarterlyData[]): QuarterlyData[] {
        throw new Error("Method not implemented.");
    }
    
}

export default PeFunction;