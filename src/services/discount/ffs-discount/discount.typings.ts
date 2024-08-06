import { BigFive } from "@/services/calculator/calculator.typings";
import { BenchmarkRatioPrice } from "../../benchmark/benchmark.typings";
import { DiscountedCashFlowPrice } from "../../financial-modeling-prep/discounted-cash-flow/discounted-cash-flow.typings";
import { StickerPrice } from "../../sticker-price/sticker-price.typings";

export interface Discount {
    cik: string
    symbol: string
    name: string,
    lastUpdated: Date,
    active: boolean
    marketPrice: number,
    annualDividend: number,
    averageVolume: number,
    description: string,
    ceo: string,
    exchange: string,
    industry: string,
    location: string,
    website: string,
    ttmInsiderPurchases: number,
    isDeleted: 'Y' | 'N',
    deletedReason?: string
    qualifiers: Qualifier[],
    stickerPrice: StickerPrice
    benchmarkRatioPrice: BenchmarkRatioPrice
    discountedCashFlowPrice: DiscountedCashFlowPrice
}

export interface Qualifier {
    cik: string
    type: keyof BigFive,
    periods: number,
    value: number
}

export interface SimpleDiscount {
    cik: string;
    symbol: string;
    name: string;
    active: boolean;
    lastUpdated: Date;
    benchmarkRatioPrice: number;
    discountedCashFlowPrice: number;
    stickerPrice: number;
}
