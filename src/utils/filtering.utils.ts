import { Statement } from "@/services/financial-modeling-prep/statement/statement.typings";
import { PeriodicData } from "../types";

// Transforms quarterly data to completed years only
export function filterToCompleteFiscalYears<T extends Statement | PeriodicData>(data: T[]): T[] {
    const firstQuarterOneIndex = data.findIndex(v => v.period === 'Q1');
    let lastQuarterFourIndex = data.length - 1;
    let periodData = data[lastQuarterFourIndex];
    while (periodData.period !== 'Q4') {
        lastQuarterFourIndex--;
        periodData = data[lastQuarterFourIndex];
    }
    return data.slice(firstQuarterOneIndex, lastQuarterFourIndex + 1);
}
