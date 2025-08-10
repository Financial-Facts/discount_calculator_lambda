import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import Function from "./Function";
import { PeriodicData } from "@/src/types";
import { getLastPeriodValue } from "@/utils/processing.utils";


export interface AverageOverPeriodVariables {
    periodicData: PeriodicData[],
    numPeriods: number
}

class AverageOverPeriodFunction implements Function<AverageOverPeriodVariables, number> {

    calculate(variables: AverageOverPeriodVariables): number {
        const {
            periodicData,
            numPeriods
        } = variables;
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

        return average;
    }
    
}

export default AverageOverPeriodFunction;