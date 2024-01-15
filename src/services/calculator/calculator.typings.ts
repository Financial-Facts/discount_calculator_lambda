import { PeriodicData } from "@/src/types";
import { BenchmarkRatioPrice } from "../benchmark/benchmark.typings";
import { StickerPrice } from "../sticker-price/sticker-price.typings";

export type TimePeriod = 'Q' | 'A';

export interface EnterpriseValueInput {
    periodicFreeCashFlow: PeriodicData[]
}

export interface BigFive {
    annualROIC: PeriodicData[],
    annualRevenue: PeriodicData[],
    annualEPS: PeriodicData[],
    annualEquity: PeriodicData[],
    annualOperatingCashFlow: PeriodicData[]
}

export type Output = number | PeriodicData[] | BenchmarkRatioPrice | StickerPrice