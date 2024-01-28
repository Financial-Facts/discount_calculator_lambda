import { RoicInput } from "@/resources/discount-manager/discount-manager.typings";
import { calculatorService } from "../../../bootstrap";
import { TimePeriod } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";
import { PeriodicData } from "@/src/types";
import { annualizeByAdd } from "@/utils/annualize.utils";
import { processPeriodicDatasets } from "@/utils/processing.utils";


class RoicFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        timePeriod: TimePeriod,
        quarterlyData: RoicInput
    }): PeriodicData[] {
        const quarterlyNOPAT = calculatorService.calculateNOPAT({
            cik: data.cik,
            timePeriod: 'Q',
            quarterlyData: data.quarterlyData
        });
        const quarterlyIC = calculatorService.calculateIC({
            cik: data.cik,
            timePeriod: 'Q',
            quarterlyData: data.quarterlyData
        });
        const quarterlyROIC = processPeriodicDatasets(data.cik, quarterlyNOPAT, quarterlyIC, (a, b) => (a / b) * 100);
        return data.timePeriod === 'A' ? annualizeByAdd(data.cik, quarterlyROIC) : quarterlyROIC;
    }

}

export default RoicFunction;