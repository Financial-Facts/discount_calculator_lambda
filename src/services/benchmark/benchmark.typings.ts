import { Valuation } from "@/src/types";

export type BenchmarkRatioPrice = Valuation<BenchmarkRatioPriceInput>;

export interface BenchmarkRatioPriceInput {
    cik: string
    industry: string
    ttmRevenue: number
    sharesOutstanding: number
    psBenchmarkRatio: number
}