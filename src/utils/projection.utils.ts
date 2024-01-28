import { calculatorService } from "../bootstrap";
import { PeriodicData } from "../types";
import { addYears } from "./date.utils";
import { processPeriodicDatasets } from "./processing.utils";


// Project periodic data using growth rate
export function projectByAverageGrowth(cik: string, numYears: number, data: PeriodicData[]): PeriodicData[] {
    const result: PeriodicData[] = [];
    const averageGrowthRate = calculatorService.calculateAverageOverPeriod({
        periodicData: calculatorService.calculatePeriodicGrowthRates({ cik: cik, periodicData: data }).slice(numYears - 1),
        numPeriods: numYears - 1
    }) / 100;

    const lastPeriod = data.slice(-1)[0];
    let value = lastPeriod.value;
    for (let i = 0; i < numYears; i++) {
        result.push({
            cik: cik,
            announcedDate: addYears(lastPeriod.announcedDate, i + 1),
            period: lastPeriod.period,
            value: value + (value * averageGrowthRate)
        });
        if (result[i]) {
            value = result[i].value;
        }
    }
    return result;
}

// Project periodic data by average percentage of other value
export function projectByAveragePercentOfValue(
    cik: string,
    data: PeriodicData[],
    historicalReferenceData: PeriodicData[],
    projectedReferenceData: PeriodicData[]
): PeriodicData[] {
    const averagePercent = calculatorService.calculateAverageOverPeriod({
        periodicData: processPeriodicDatasets(cik,
            data,
            historicalReferenceData, (a, b) => (a / b)),
        numPeriods: data.length
    });
    return projectedReferenceData.map((projectedReferenceData) => ({
        cik: cik,
        announcedDate: projectedReferenceData.announcedDate,
        period: projectedReferenceData.period,
        value: projectedReferenceData.value * averagePercent
    }));
}