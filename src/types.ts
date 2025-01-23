export type Period = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY';

export interface Valuation<T> {
    cik: string,
    price: number,
    input: T
}

export interface PeriodicData {
    cik: string
    announcedDate: Date
    period?: Period
    value: number
}

export interface Consumer {
    startPolling(): Promise<void>   
}

export interface SqsMsgBody {
    Records: EventItem[]
}

export interface EventItem {
    body: string
}


