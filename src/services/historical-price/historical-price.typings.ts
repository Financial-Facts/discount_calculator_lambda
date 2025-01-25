export enum Frequency {
    DAILY = '1d',
    WEEKLY = '1w',
    MONTHLY = '1m',
    YEAR = '1v'
}

export interface HistoricalPriceInput {
    symbols: string[];
    fromDate: Date;
    toDate: Date;
    frequency: Frequency
}

export interface PriceData {
    date: Date,
    close: number
}