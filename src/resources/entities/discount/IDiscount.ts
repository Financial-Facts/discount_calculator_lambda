import { PeriodicData } from "../models/PeriodicData";
import TrailingPriceData from "./models/TrailingPriceData";

export default interface Discount {

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
