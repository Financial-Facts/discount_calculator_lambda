import { BvpsInput } from "@/resources/discount-manager/discount-manager.typings";
import { TimePeriod } from "../calculator.typings";
import Function from "./Function";
import { PeriodicData } from "@/src/types";
import { annualizeByLastQuarter } from "@/utils/annualize.utils";
import { processPeriodicDatasets } from "@/utils/processing.utils";


export interface BvpsVariables {
    cik: string,
    timePeriod: TimePeriod,
    quarterlyData: BvpsInput
};

class BvpsFunction implements Function<BvpsVariables, PeriodicData[]> {

    calculate(variables: BvpsVariables): PeriodicData[] {
        const quarterlyData = variables.quarterlyData;
        const quarterly_shareholder_equity = quarterlyData.quarterlyShareholderEquity;
        const quarterly_outstanding_shares = quarterlyData.quarterlyOutstandingShares;
        const quarterlyBVPS = processPeriodicDatasets(variables.cik,
        quarterly_shareholder_equity, quarterly_outstanding_shares, (a, b) => a/b);
        return variables.timePeriod === 'A' ? annualizeByLastQuarter(variables.cik, quarterlyBVPS) : quarterlyBVPS;
    }
    
}

export default BvpsFunction;