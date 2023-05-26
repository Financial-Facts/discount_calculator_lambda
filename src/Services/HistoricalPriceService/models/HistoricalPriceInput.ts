import { Frequency } from "./Frequency";

export default interface HistoricalPriceInput {
    symbol: string;
    fromDate: Date;
    toDate: Date;
    frequency: Frequency
}