export type Period = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY';

export interface PeriodicData {
    cik: string
    announcedDate: Date
    period: Period
    value: number
}

export interface QuarterlyData {
    quarterlyShareholderEquity: PeriodicData[]
    quarterlyOutstandingShares: PeriodicData[]
    quarterlyEPS: PeriodicData[]
    quarterlyOperatingIncome: PeriodicData[]
    quarterlyTaxExpense: PeriodicData[]
    quarterlyNetDebt: PeriodicData[]
    quarterlyTotalEquity: PeriodicData[]
    quarterlyRevenue: PeriodicData[]
    quarterlyOperatingCashFlow: PeriodicData[]
    quarterlyFreeCashFlow: PeriodicData[]
}