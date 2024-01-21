import { Valuation } from "@/src/types";

export type BenchmarkRatioPrice = Valuation<BenchmarkPriceInput>;

export interface BenchmarkPriceInput {
    cik: string
    industry: string
    ttmRevenue: number
    sharesOutstanding: number
    psBenchmarkRatio: number
}