import HistoricalPriceInput from "@/services/historical-price/models/HistoricalPriceInput";
import PriceData from "@/services/historical-price/models/PriceData";
import { buildHistoricalPriceInput } from "@/services/historical-price/utils/HistoricalPriceUtils";
import StickerPriceData, { PeriodicData } from "@/services/sticker-price/sticker-price.typings";
import { annualizeByAdd, days_between } from "@/services/sticker-price/utils/QuarterlyDataUtils";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import AbstractFunction from "./AbstractFunction";
import { historicalPriceService } from "../../../../../bootstrap";



class PeFunction extends AbstractFunction {

    constructor() {
        super();
    }

    async calculate(data: StickerPriceData): Promise<PeriodicData[]> {
        const annualPE: PeriodicData[] = [];
        const annualEPS = annualizeByAdd(data.cik, data.quarterlyEPS);
        const historicalPriceInput =
            this.buildHistoricalPriceInput(data.symbol, annualEPS);
        return historicalPriceService.getHistoricalPrices(historicalPriceInput)
            .then(async (priceData: PriceData[]) => {
                annualEPS.forEach(fy => {
                    const price = priceData.find(day => {
                        return days_between(new Date(day.date), new Date(fy.announcedDate)) <= 3;
                    })?.close;
                    if (!price) {
                        console.log("Insufficient historical price data available for " + data.cik);
                        throw new InsufficientDataException("Insufficient historical price data available");
                    }
                    annualPE.push({
                        cik: data.cik,
                        announcedDate: fy.announcedDate,
                        period: 'FY',
                        value: fy.value !== 0 ? price/fy.value : 0
                    });
                });
                return annualPE;
            });
    }

    private buildHistoricalPriceInput(symbol: string, quarterlyEPS: PeriodicData[]): HistoricalPriceInput {
        const fromDate: Date = new Date(quarterlyEPS[0].announcedDate);
        const toDate: Date = new Date(quarterlyEPS[quarterlyEPS.length - 1].announcedDate);
        toDate.setDate(toDate.getDate() + 3); 
        return buildHistoricalPriceInput(symbol, fromDate, toDate)
    }
    
}

export default PeFunction;