import { BvpsInput } from "@/resources/discount-manager/discount-manager.typings";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";
import { PeriodicData } from "@/src/types";
import { annualizeByLastQuarter } from "@/utils/annualize.utils";
import { processPeriodicDatasets } from "@/utils/processing.utils";


class BvpsFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: BvpsInput
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