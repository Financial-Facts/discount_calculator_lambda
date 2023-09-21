import { BenchmarkRatioPrice } from "../benchmark/benchmark.typings";
import { StickerPrice } from "../sticker-price/sticker-price.typings";

export type Discount = StickerPrice & BenchmarkRatioPrice;

export interface SimpleDiscount {
    cik: string;
    symbol: string;
    name: string;
    active: boolean;
    ratio_Price?: number;
    ttmSalePrice: number;
    tfySalePrice: number;
    ttySalePrice: number;
}

export interface TrailingPriceData {
    cik: string;
    stickerPrice: number;
    salePrice: number;
}
