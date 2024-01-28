import { PeriodicData } from "../types";

// Annualizes PeriodicData by adding together values
export function annualizeByAdd(cik: string, data: PeriodicData[]): PeriodicData[] {
    const period = data.slice(-1)[0].period;
    const annualData: PeriodicData[] = [];
    let i = 0;
    while (i < data.length) {
        annualData.push(data.slice(i, i + 4).reduce((quarter1, quarter2) => {
            return {
                cik: cik,
                announcedDate: new Date(data[i + 3].announcedDate),
                period: period,
                value: quarter1.value + quarter2.value
            }
        }));
        i = i + 4;
    }
    return annualData;
}

// Annualizes data using last quarter in the FY
export function annualizeByLastQuarter(cik: string, data: PeriodicData[]): PeriodicData[] {
    const lastQuarter = data[data.length - 1].period;
    return data.filter(quarter => quarter.period === lastQuarter).map(quarter => {
        return {
            cik: cik,
            announcedDate: quarter.announcedDate,
            period: quarter.period,
            value: quarter.value
        }
    });
}