import { IcInput, QuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { TimePeriod } from "../calculator.typings";
import Function from "./Function";
import { PeriodicData } from "@/src/types";
import { annualizeByLastQuarter } from "@/utils/annualize.utils";
import { processPeriodicDatasets } from "@/utils/processing.utils";


export interface IcVariables {
    cik: string,
    timePeriod: TimePeriod,
    quarterlyData: IcInput
}

class IcFunction implements Function<IcVariables, PeriodicData[]>{

    calculate(variables: IcVariables): PeriodicData[] {
        const quarterlyNetDebt = variables.quarterlyData.quarterlyNetDebt;
        const quarterlyTotalEquity = variables.quarterlyData.quarterlyTotalEquity;
        const quarterlyIC = processPeriodicDatasets(variables.cik, quarterlyNetDebt, quarterlyTotalEquity, (a, b) => a + b);
        return variables.timePeriod === 'A' ? annualizeByLastQuarter(variables.cik, quarterlyIC) : quarterlyIC;
    }
    
}

export default IcFunction;