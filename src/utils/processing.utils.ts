import { Statement } from "@/services/financial-modeling-prep/statement/statement.typings";
import { PeriodicData } from "../types";

export function reduceTTM(
    data: PeriodicData[],
    equation: ((input1: number, input2: number) => number)
): number {
    return data
        .slice(-4)
        .map(period => period.value)
        .reduce((a, b) => equation(a, b));
}

export function getLastPeriodValue(
    data: PeriodicData[]
): number {
    return data.slice(-1)[0].value;
}

export function getLastStatement<T extends Statement>(
    data: T[]
): any {
    return data.slice(-1)[0];
}

export function getLastQ4Value<T extends Statement> (
    statements: T[]
): T {
    return statements.filter(statement => statement.period === 'Q4').slice(-1)[0];
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