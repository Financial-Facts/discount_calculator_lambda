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
    stickerPrice: StickerPrice
    benchmarkRatioPrice: BenchmarkRatioPrice
    discountedCashFlowPrice: DiscountedCashFlowPrice
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
