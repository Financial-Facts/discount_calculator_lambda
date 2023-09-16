import { PeriodicData } from "../../entities/models/PeriodicData";

export interface Discount {
    cik: string;
    symbol: string;
    name: string;
    active: boolean;
    ratioPrice?: number;
    lastUpdated?: Date
    ttmPriceData: TrailingPriceData
    tfyPriceData: TrailingPriceData
    ttyPriceData: TrailingPriceData
    quarterlyBVPS: PeriodicData[]
    quarterlyPE: PeriodicData[]
    quarterlyEPS: PeriodicData[]
    quarterlyROIC: PeriodicData[]
    annualROIC: PeriodicData[]
}

export interface SimpleDiscount {
    cik: string;
    symbol: string;
    name: string;
    active: boolean;
    ratioPrice?: number;
    ttmSalePrice: number;
    tfySalePrice: number;
    ttySalePrice: number;
}

export interface TrailingPriceData {
    cik: string;
    stickerPrice: number;
    salePrice: number;
}
