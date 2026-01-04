import { NopatInput } from "@/resources/discount-manager/discount-manager.typings";
import { TimePeriod } from "../calculator.typings";
import Function from "./Function";
import { PeriodicData } from "@/src/types";
import { annualizeByAdd } from "@/utils/annualize.utils";
import { processPeriodicDatasets } from "@/utils/processing.utils";


export interface NopatVariables {
    cik: string,
    timePeriod: TimePeriod,
    quarterlyData: NopatInput
}

class NopatFunction implements Function<NopatVariables, PeriodicData[]> {

    calculate(variables: NopatVariables): PeriodicData[] {
        const quarterlyTaxExpense = variables.quarterlyData.quarterlyTaxExpense;
        const quarterlyOperatingIncome = variables.quarterlyData.quarterlyOperatingIncome;
        const quarterlyNOPAT = processPeriodicDatasets(variables.cik, quarterlyOperatingIncome, quarterlyTaxExpense, (a, b) => a - b);
        return variables.timePeriod === 'A' ? annualizeByAdd(variables.cik, quarterlyNOPAT) : quarterlyNOPAT;
    }
    
}

export default NopatFunction;