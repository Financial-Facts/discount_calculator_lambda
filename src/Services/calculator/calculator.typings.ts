import { PeriodicData } from "@/src/types";

export type TimePeriod = 'Q' | 'A';

export interface BigFive {
    annualROIC: PeriodicData[],
    annualRevenue: PeriodicData[],
    annualEPS: PeriodicData[],
    annualEquity: PeriodicData[],
    annualOperatingCashFlow: PeriodicData[]
}