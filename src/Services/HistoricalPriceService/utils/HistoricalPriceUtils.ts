import { Frequency } from "../models/Frequency";
import HistoricalPriceInput from "../models/HistoricalPriceInput";
import PriceData from "../models/PriceData";

export function buildHistoricalPriceInput(symbol: string, fromDate: Date, toDate: Date): HistoricalPriceInput {
    return {
        symbol: symbol,
        fromDate: getUnixTimestamp(fromDate),
        toDate: getUnixTimestamp(toDate),
        frequency: Frequency.DAILY
    }
}

export function mapCSVToPriceData(csv: string): PriceData[] {
    const array = csv.split("\n");
    return array.slice(1).map(row =>  {
        const parts: string[] = row.split(',');
        return {
            date: new Date(parts[0]),
            close: +parts[5]
        }
    });
}

function getUnixTimestamp(date: Date): number {
    return Math.floor(date.valueOf() / 1000);
}