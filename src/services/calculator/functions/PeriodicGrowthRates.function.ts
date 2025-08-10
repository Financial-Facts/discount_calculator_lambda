import { PeriodicData } from "@/src/types";
import Function from "./Function";


export interface PeriodicGrowthRatesVariables {
    cik: string,
    periodicData: PeriodicData[]
}

class PeriodicGrowthRatesFunction implements Function<PeriodicGrowthRatesVariables, PeriodicData[]> {

    calculate(variables: PeriodicGrowthRatesVariables): PeriodicData[] {
        const periodicGrowthRates: PeriodicData[] = [];
        const periodicData = variables.periodicData;

        let i = 1;
        while (i < periodicData.length) {
            const previous = periodicData[i - 1];
            const current = periodicData[i];
            const growthRate = ((current.value - previous.value) / Math.abs(previous.value)) * 100;
            periodicGrowthRates.push({
                cik: variables.cik,
                announcedDate: current.announcedDate,
                period: current.period,
                value: growthRate
            });
            i++;
        }
        return periodicGrowthRates;
    }
    
}

export default PeriodicGrowthRatesFunction;