import { PeriodicData } from "../sticker-price.typings";

// Returns the number of days between two dates
export function days_between(d1: Date, d2: Date): number {
    const diff = Math.abs(d1.getTime() - d2.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24));
}

// Annualizes PeriodicData by adding together values
export function annualizeByAdd(cik: string, data: PeriodicData[]): PeriodicData[] {
    const annualData: PeriodicData[] = [];
    let i = 0;
    while (i < data.length) {
        annualData.push(data.slice(i, i + 4).reduce((quarter1, quarter2) => {
            return {
                cik: cik,
                announcedDate: new Date(data[i + 3].announcedDate),
                period: 'FY',
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
            cik: quarter.cik,
            announcedDate: quarter.announcedDate,
            period: quarter.period,
            value: quarter.value
        }
    });
}

// Processes quarterly data by perform an equation using the reported value of
// data1 with the value available from the closest date from data2 and vice versa
export function processPeriodicDatasets(
    cik: string,
    data1: PeriodicData[],
    data2: PeriodicData[],
    equation: ((input1: number, input2: number) => number)
): PeriodicData[] {
    let index = 0;
    return data1.map(quarter1 => {
        const result: PeriodicData = {
            cik: cik,
            announcedDate: quarter1.announcedDate,
            period: quarter1.period,
            value: equation(quarter1.value, data2[index].value)
        }
        index++;
        return result;
    });
}
