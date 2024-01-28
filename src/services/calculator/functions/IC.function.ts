import { IcInput, QuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";
import { PeriodicData } from "@/src/types";
import { annualizeByLastQuarter } from "@/utils/annualize.utils";
import { processPeriodicDatasets } from "@/utils/processing.utils";


class IcFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: IcInput
    }): PeriodicData[] {
        const quarterlyNetDebt = data.quarterlyData.quarterlyNetDebt;
        const quarterlyTotalEquity = data.quarterlyData.quarterlyTotalEquity;
        const quarterlyIC = processPeriodicDatasets(data.cik, quarterlyNetDebt, quarterlyTotalEquity, (a, b) => a + b);
        return data.timePeriod === 'A' ? annualizeByLastQuarter(data.cik, quarterlyIC) : quarterlyIC;
    }
    
}

export default IcFunction;