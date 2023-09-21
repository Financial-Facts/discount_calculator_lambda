import { PeriodicData } from "@/services/sticker-price/sticker-price.typings";

export type TimePeriod = 'Q' | 'A';

export interface BigFive {
    annualROIC: PeriodicData[],
    annualRevenue: PeriodicData[],
    annualEPS: PeriodicData[],
    annualEquity: PeriodicData[],
    annualOperatingCashFlow: PeriodicData[]
}