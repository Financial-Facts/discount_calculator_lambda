import { RoicInput } from "@/resources/discount-manager/discount-manager.typings";
import { calculatorService } from "../../../bootstrap";
import { TimePeriod } from "../calculator.typings";
import Function from "./Function";
import { PeriodicData } from "@/src/types";
import { annualizeByAdd } from "@/utils/annualize.utils";
import { processPeriodicDatasets } from "@/utils/processing.utils";
import { icFunction, nopatFunction } from "../calculator.service";
import NopatFunction, { NopatVariables } from "./NOPAT.function";
import IcFunction, { IcVariables } from "./IC.function";


export interface RoicVariables {
    cik: string,
    timePeriod: TimePeriod,
    quarterlyData: RoicInput
}

class RoicFunction implements Function<RoicVariables, PeriodicData[]> {

    calculate(variables: RoicVariables): PeriodicData[] {
        const quarterlyNOPAT = calculatorService.calculate(
            {
                cik: variables.cik,
                timePeriod: 'Q' as TimePeriod,
                quarterlyData: variables.quarterlyData
            },
            nopatFunction
        );
        const quarterlyIC = calculatorService.calculate(
            {
                cik: variables.cik,
                timePeriod: 'Q' as TimePeriod,
                quarterlyData: variables.quarterlyData
            },
            icFunction
        );
        const quarterlyROIC = processPeriodicDatasets(variables.cik, quarterlyNOPAT, quarterlyIC, (a, b) => (a / b) * 100);
        return variables.timePeriod === 'A' ? annualizeByAdd(variables.cik, quarterlyROIC) : quarterlyROIC;
    }

}

export default RoicFunction;