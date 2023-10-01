export enum Frequency {
    DAILY = '1d',
    WEEKLY = '1w',
    MONTHLY = '1m',
    YEAR = '1v'
}

export interface HistoricalPriceInput {
    symbol: string;
    fromDate: number;
    toDate: number;
    frequency: Frequency
}

export interface PriceData {
    date: Date,
    close: number
}