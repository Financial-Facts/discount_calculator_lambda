import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import AbstractFunction from "./AbstractFunction";
import { historicalPriceService } from "../../../bootstrap";
import { TimePeriod } from "../calculator.typings";
import { PeriodicData } from "@/src/types";
import { PeInput } from "@/resources/discount-manager/discount-manager.typings";
import { days_between } from "@/utils/date.utils";
import { annualizeByAdd } from "@/utils/annualize.utils";
import { PriceData, HistoricalPriceInput, Frequency } from "@/services/historical-price/historical-price.typings";



class PeFunction extends AbstractFunction {

    constructor() {
        super();
    }

    async calculate(data: {
        cik: string,
        timePeriod: TimePeriod,
        symbols: string[],
        quarterlyData: PeInput
    }): Promise<PeriodicData[]> {
        const annualPE: PeriodicData[] = [];
        const isAnnual = data.timePeriod === 'A';
        const periodicEPS = isAnnual ?
            annualizeByAdd(data.cik, data.quarterlyData.quarterlyEPS) :
            data.quarterlyData.quarterlyEPS;
        const historicalPriceInput =
            this.buildHistoricalPriceInput(data.symbols, periodicEPS);
        return historicalPriceService.getHistoricalPrices(historicalPriceInput)
            .then(async (priceData: PriceData[]) => {
                periodicEPS.forEach(period => {
                    const price = priceData.find(day => {
                        return days_between(new Date(day.date), new Date(period.announcedDate)) <= 3;
                    })?.close;
                    if (!price) {
                        console.log("Insufficient historical price data available for " + data.cik);
                        throw new InsufficientDataException("Insufficient historical price data available");
                    }
                    annualPE.push({
                        cik: data.cik,
                        announcedDate: period.announcedDate,
                        period: isAnnual ? 'FY' : period.period,
                        value: period.value > 0 ? price/period.value : 0
                    });
                });
                return annualPE;
            });
    }

    private buildHistoricalPriceInput(symbols: string[], quarterlyEPS: PeriodicData[]): HistoricalPriceInput {
        const fromDate: Date = new Date(quarterlyEPS[0].announcedDate);
        const toDate: Date = new Date(quarterlyEPS[quarterlyEPS.length - 1].announcedDate);
        toDate.setDate(toDate.getDate() + 3); 
        return {
            symbols, 
            fromDate,
            toDate,
            frequency: Frequency.DAILY
        };
    }
    
}

export default PeFunction;