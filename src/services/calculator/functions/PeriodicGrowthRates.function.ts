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
            const previous = periodicData[i - 1];
            const current = periodicData[i];
            const growthRate = ((current.value - previous.value) / Math.abs(previous.value)) * 100;
            periodicGrowthRates.push({
                cik: data.cik,
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