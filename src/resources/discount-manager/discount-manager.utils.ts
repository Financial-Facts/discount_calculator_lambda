import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { PeriodicData } from "@/src/types";
import { Statement, Statements } from "@/services/financial-modeling-prep/statement/statement.typings";
import { days_between } from "@/utils/global.utils";
import DataNotUpdatedException from "@/utils/exceptions/DataNotUpdatedException";

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

export function validateStatements(cik: string, data: Statements): void {
    checkHasSufficientStatements(cik, data);
    checkStatementsHaveBeenUpdated(cik, data);
}

function checkHasSufficientStatements(cik: string, data: Statements): void {
    if (data.incomeStatements.length !== 44 ||
        data.balanceSheets.length !== 44 ||
        data.cashFlowStatements.length !== 44) {
        throw new InsufficientDataException(`${cik} has insufficent statements available`);
    }
}

function checkStatementsHaveBeenUpdated(cik: string, data: Statements): void {
    if (!isUpToDate(data.balanceSheets) ||
        !isUpToDate(data.incomeStatements) ||
        !isUpToDate(data.cashFlowStatements)) {
        throw new DataNotUpdatedException(`Data for ${cik} has not yet been updated!`);
    }
}

function isUpToDate<T extends Statement>(statements: T[]): boolean {
    const lastReportedData: Date = new Date(statements.slice(-1)[0].fillingDate);
    return days_between(lastReportedData, new Date()) < 7;
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
            cik: cik,
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
