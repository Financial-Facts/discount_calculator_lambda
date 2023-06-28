import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import HistoricalPriceService from "../../../../../Services/HistoricalPriceService/HistoricalPriceService";
import { buildHistoricalPriceInput } from "../../../../../Services/HistoricalPriceService/utils/HistoricalPriceUtils";
import Identity from "@/resources/entities/Identity";
import PriceData from "../../../../../Services/HistoricalPriceService/models/PriceData";
import { days_between, median_date } from "../../../../../Services/StickerPriceService/utils/StickerPriceUtils";
import { Variables } from "../calculator";

class PeFunction extends AbstractFunction {

    private historicalPriceService: HistoricalPriceService;
    private quarterlyEPS: QuarterlyData[];
    private identity: Identity;
    private priceData: PriceData[];

    constructor(identity: Identity, variables: Variables) {
        super();
        this.identity = identity;
        this.historicalPriceService = new HistoricalPriceService();
        this.priceData = [];
        this.quarterlyEPS = variables.EPS;
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

    // // ToDo: come up with faster way to fetch historical data
    // async setVariables(variables: Variables): Promise<void> {
    //     const fromDate: Date = this.quarterlyEPS[0].announcedDate;
    //     const toDate: Date = this.quarterlyEPS[this.quarterlyEPS.length - 1].announcedDate;
    //     toDate.setDate(toDate.getDate() + 3);            
    //     await this.historicalPriceService.getHistoricalPrices(
    //         buildHistoricalPriceInput(this.identity, fromDate, toDate))
    //             .then(priceData => {
    //                 this.priceData = priceData;
    //             });
    //     return Promise.resolve();
    // }

    annualize(quarterlyPE: QuarterlyData[]): QuarterlyData[] {
        throw new Error("Method not implemented.");
    }
    
}

export default PeFunction;