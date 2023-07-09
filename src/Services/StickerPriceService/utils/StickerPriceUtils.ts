import QuarterlyData from "@/resources/entities/models/QuarterlyData";

// Returns the number of days between two dates
export function days_between(d1: Date, d2: Date): number {
    const diff = Math.abs(d1.getTime() - d2.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24));
}

// Returns the median date between two dates
export function median_date(d1: Date, d2: Date): Date {
     return new Date((d1.getTime() + d2.getTime()) / 2);
}

// Converts set of numbers into four quarters by adding them together
export function quarterize(data: number[]): number[] {
    const chunkSize: number = data.length/4; 
    const result: number[] = [];
    let i = data.length;
    while (i >= 1) {
        const chunk = data.slice(i - chunkSize, i);
        result.splice(0, 0,
            chunk.reduce((a: number, b: number) => {
                return a + b;
            })/chunk.length);
        i -= chunkSize;
    }
    return result;
}

// Annualizes QuarterlyData by adding together values
export function annualizeByAdd(cik: string, data: QuarterlyData[]): QuarterlyData[] {
    const annualData: QuarterlyData[] = [];
    let i = data.length - 1;
    while (i - 4 >= 0) {
        annualData.unshift(data.slice(i - 3, i + 1).reduce((quarter1, quarter2) => {
            return {
                cik: cik,
                announcedDate: new Date(data[i].announcedDate),
                value: quarter1.value + quarter2.value
            }
        }));
        i = i - 4;
    }
    return annualData;
}

// Annualizes QuarterlyData by taking the average of the quarters
export function annualizeByMean(cik: string, data: QuarterlyData[]): QuarterlyData[] {
    return annualizeByAdd(cik, data).map(year => {
        year.value = year.value/4;
        return year;
    });
}

// Processes quarterly data by perform an equation using the reported value of
// data1 with the value available from the closest date from data2 and vice versa
export function processQuarterlyDatasets(
        cik: string,
        maxDaysDifference: number,
        data1: QuarterlyData[],
        data2: QuarterlyData[],
        equation: ((input1: number, input2: number) => number)
): QuarterlyData[] {
    const processedData: QuarterlyData[] = [];
    let index1 = 0;
    let index2 = 0;
    while (index1 < data1.length && index2 < data2.length) {
        let data1Date = new Date(data1[index1].announcedDate);
        let data2Date = new Date(data2[index2].announcedDate);
        while (data2Date.getTime() <= data1Date.getTime() && index2 + 1 !== data2.length) {
            if (days_between(data1Date, data2Date) <= maxDaysDifference) {
                processedData.push({
                    cik: cik,
                    announcedDate: median_date(data1Date, data2Date),
                    value: equation(data1[index1].value, data2[index2].value)
                });
            }
            index2++;
            data2Date = new Date(data2[index2].announcedDate);
        }
        while (data1Date.getTime() <= data2Date.getTime() && index1 + 1 !== data1.length) {
            if (days_between(data1Date, data2Date) <= maxDaysDifference) {
                processedData.push({
                    cik: cik,
                    announcedDate: median_date(data1Date, data2Date),
                    value: equation(data1[index1].value, data2[index2].value)
                });
            }
            index1++;
            data1Date = new Date(data1[index1].announcedDate);
        }
        if (index1 + 1 === data1.length || index2 + 1 === data2.length) {
            while (index1 + 1 <= data1.length || index2 + 1 <= data2.length) {
                if (days_between(data1Date, data2Date) <= maxDaysDifference) {
                    processedData.push({
                        cik: cik,
                        announcedDate: median_date(data1Date, data2Date),
                        value: equation(data1[index1].value, data2[index2].value)
                    });
                }
                if (index1 + 1 !== data1.length) {
                    index1++;
                    data1Date = new Date(data1[index1].announcedDate);
                } else if (index2 + 1 !== data2.length) {
                    index2++;
                    data2Date = new Date(data2[index2].announcedDate);
                } else {
                    return processedData;
                }
            }
        }
    }
    return processedData;
}