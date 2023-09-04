import AbstractFunction from "./AbstractFunction";
import { buildHistoricalPriceInput } from "../../../../../Services/HistoricalPriceService/utils/HistoricalPriceUtils";
import PriceData from "../../../../../Services/HistoricalPriceService/models/PriceData";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import HistoricalPriceInput from "Services/HistoricalPriceService/models/HistoricalPriceInput";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { historicalPriceService } from "../../../../../bootstrap";
import { PeriodicData } from "@/resources/entities/models/PeriodicData";
import { annualizeByAdd, days_between } from "../../../../../Services/StickerPriceService/utils/QuarterlyDataUtils";

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