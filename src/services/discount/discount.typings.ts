import { BenchmarkRatioPrice } from "../benchmark/benchmark.typings";
import { DiscountedCashFlowPrice } from "../financial-modeling-prep/discounted-cash-flow/discounted-cash-flow.typings";
import { StickerPrice } from "../sticker-price/sticker-price.typings";

export interface Discount {
    cik: string
    symbol: string
    name: string
    lastUpdated: Date
    active: boolean
    stickerPrice: StickerPrice
    benchmarkRatioPrice: BenchmarkRatioPrice
    discountCashFlowPrice: DiscountedCashFlowPrice
}

export interface SimpleDiscount {
    cik: string;
    symbol: string;
    name: string;
    active: boolean;
    ratio_Price: number;
    ttmSalePrice: number;
    tfySalePrice: number;
    ttySalePrice: number;
}
