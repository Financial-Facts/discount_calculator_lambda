import { QuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { processPeriodicDatasets, annualizeByAdd } from "@/resources/discount-manager/discount-manager.utils";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";
import { PeriodicData } from "@/src/types";


class NopatFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: QuarterlyData
    }): PeriodicData[] {
        const quarterlyTaxExpense = data.quarterlyData.quarterlyTaxExpense;
        const quarterlyOperatingIncome = data.quarterlyData.quarterlyOperatingIncome;
        const quarterlyNOPAT = processPeriodicDatasets(data.cik, quarterlyOperatingIncome, quarterlyTaxExpense, (a, b) => a - b);
        return data.timePeriod === 'A' ? annualizeByAdd(data.cik, quarterlyNOPAT) : quarterlyNOPAT;
    }
    
}

export default NopatFunction;