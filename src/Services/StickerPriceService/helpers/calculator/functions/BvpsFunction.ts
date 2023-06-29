import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import { days_between, median_date, processQuarterlyDatasets, quarterize } from "../../../../../Services/StickerPriceService/utils/StickerPriceUtils";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

class BvpsFunction extends AbstractFunction {

    async calculate(data: StickerPriceData): Promise<QuarterlyData[]> {
        const quarterly_shareholder_equity = data.quarterlyShareholderEquity;
        const quarterly_outstanding_shares = data.quarterlyOutstandingShares;
        return processQuarterlyDatasets(data.cik, 365, quarterly_shareholder_equity, quarterly_outstanding_shares, (a, b) => a/b);
    }

    annualize(cik: string, quarterlyBVPS: QuarterlyData[]): QuarterlyData[] {
        let index = quarterlyBVPS.length - 1;
        const annualBVPS: QuarterlyData[] = [];
        while (index >= 0) {
            let sum = quarterlyBVPS[index].value;
            let count = 1;
            let periodStartDate: Date = quarterlyBVPS[index].announcedDate;
            index--;
            while (index >= 0 && days_between(periodStartDate, quarterlyBVPS[index].announcedDate) <= 365) {
                sum += quarterlyBVPS[index].value;
                count++;
                index--;
            }
            annualBVPS.unshift({
                cik: cik,
                announcedDate: periodStartDate,
                value: sum/count
            });
        }
        return annualBVPS;
    }

    getLastQuarterAndAnnualizedData(cik: string, quartertlyBVPS: QuarterlyData[]):
        { lastQuarters: number[]; annualBVPS: QuarterlyData[]; }
    {
        return {
            lastQuarters: this.getLastQuarterData(quartertlyBVPS),
            annualBVPS: this.annualize(cik, quartertlyBVPS)
        }
    }

    private getLastQuarterData(quarterlyBVPS: QuarterlyData[]): number[] {
        let lastQuarters: number[] = [];
        let index = quarterlyBVPS.length - 1;
        let periodStartDate: Date = quarterlyBVPS[index].announcedDate;
        index--;
        while (index >= 0 && days_between(periodStartDate, quarterlyBVPS[index].announcedDate) <= 365) {
            index--;
        }
        for (let i = index + 1; i < quarterlyBVPS.length; i++) {
            lastQuarters.push(quarterlyBVPS[i].value);
        }
        lastQuarters = quarterize(lastQuarters);
        return lastQuarters;
    }
    
}

export default BvpsFunction;