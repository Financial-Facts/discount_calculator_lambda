import { PeriodicData, QuarterlyData } from "../../sticker-price/sticker-price.typings";
import { annualizeByLastQuarter, processPeriodicDatasets } from "../../sticker-price/utils/periodic-data.utils";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";


class BvpsFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: QuarterlyData
    }): PeriodicData[] {
        const quarterlyData = data.quarterlyData;
        const quarterly_shareholder_equity = quarterlyData.quarterlyShareholderEquity;
        const quarterly_outstanding_shares = quarterlyData.quarterlyOutstandingShares;
        const quarterlyBVPS = processPeriodicDatasets(data.cik,
        quarterly_shareholder_equity, quarterly_outstanding_shares, (a, b) => a/b);
        return data.timePeriod === 'A' ? annualizeByLastQuarter(data.cik, quarterlyBVPS) : quarterlyBVPS;
    }
    
}

export default BvpsFunction;