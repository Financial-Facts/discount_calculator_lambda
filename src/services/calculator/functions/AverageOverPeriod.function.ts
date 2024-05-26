import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import AbstractFunction from "./AbstractFunction";
import { PeriodicData } from "@/src/types";
import { getLastPeriodValue } from "@/utils/processing.utils";


class AverageOverPeriodFunction extends AbstractFunction {

    calculate(data: {
        periodicData: PeriodicData[],
        numPeriods: number,
        minimum?: number,
        errorMessage?: string
    }): number {
        const periodicData = data.periodicData;
        const numPeriods = data.numPeriods;
        let average = 0;
        
        if (numPeriods === 1) {
            average = getLastPeriodValue(periodicData);
        }

        if (numPeriods > 1) {
            average = periodicData
                .slice(0 - numPeriods)
                .map(period => period.value)
                .reduce((a, b) => a + b) / numPeriods;
        }

        if (data.minimum && average < data.minimum) {
            if (data.errorMessage) {
                throw new DisqualifyingDataException(data.errorMessage);
            }
            throw new DisqualifyingDataException(`Average does not meet a minimum of ${data.minimum}`);
        }
        return average;
    }
    
}

export default AverageOverPeriodFunction;