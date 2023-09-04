export type Period = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY'

export interface PeriodicData {

    cik: string

    announcedDate: Date

    period: Period

    value: number

}