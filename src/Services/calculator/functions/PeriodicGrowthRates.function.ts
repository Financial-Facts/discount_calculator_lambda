import { PeriodicData } from "@/src/types";
import AbstractFunction from "./AbstractFunction";


class PeriodicGrowthRatesFunction extends AbstractFunction {

    calculate(data: {
        cik: string,
        periodicData: PeriodicData[]
    }): PeriodicData[] {
        const periodicGrowthRates: PeriodicData[] = [];
        const periodicData = data.periodicData;
        let i = 1;
        while (i < periodicData.length) {
            let previous = periodicData[i - 1];
            let current = periodicData[i];
            periodicGrowthRates.push({
                cik: data.cik,
                announcedDate: current.announcedDate,
                period: current.period,
                value: ((current.value - previous.value) / Math.abs(previous.value)) * 100
            });
            i++;
        }
        return periodicGrowthRates;
    }
    
}

export default PeriodicGrowthRatesFunction;