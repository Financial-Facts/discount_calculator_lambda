import { Frequency } from "./Frequency";

export default interface HistoricalPriceInput {
    symbol: string;
    fromDate: number;
    toDate: number;
    frequency: Frequency
}