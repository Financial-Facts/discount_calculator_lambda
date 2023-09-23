import { PeriodicData } from "@/resources/consumers/price-check-consumer/discount-manager/discount-manager.typings";

export type TimePeriod = 'Q' | 'A';

export interface BigFive {
    annualROIC: PeriodicData[],
    annualRevenue: PeriodicData[],
    annualEPS: PeriodicData[],
    annualEquity: PeriodicData[],
    annualOperatingCashFlow: PeriodicData[]
}