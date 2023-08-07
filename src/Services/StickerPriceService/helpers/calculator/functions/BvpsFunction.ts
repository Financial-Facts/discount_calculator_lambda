import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import AbstractFunction from "./AbstractFunction";
import { annualizeByMean, days_between, processQuarterlyDatasets, quarterize } from "../../../utils/QuarterlyDataUtils";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

class BvpsFunction extends AbstractFunction {

    async calculate(data: StickerPriceData): Promise<QuarterlyData[]> {
        const quarterly_shareholder_equity = data.quarterlyShareholderEquity;
        const quarterly_outstanding_shares = data.quarterlyOutstandingShares;
        return processQuarterlyDatasets(data.cik, 365, quarterly_shareholder_equity, quarterly_outstanding_shares, (a, b) => a/b);
    }

    annualize(cik: string, quarterlyBVPS: QuarterlyData[]): QuarterlyData[] {
        return annualizeByMean(cik, quarterlyBVPS);
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