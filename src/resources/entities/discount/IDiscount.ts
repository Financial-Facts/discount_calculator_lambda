import QuarterlyData from "../models/QuarterlyData";
import TrailingPriceData from "./models/TrailingPriceData";

export default interface Discount {

    cik: string;

    symbol: string;

    name: string;

    ratioPrice?: number;

    lastUpdated?: Date

    ttmPriceData: TrailingPriceData[]

    tfyPriceData: TrailingPriceData[]

    ttyPriceData: TrailingPriceData[]

    quarterlyBVPS: QuarterlyData[]

    quarterlyPE: QuarterlyData[]

    quarterlyEPS: QuarterlyData[]

    quarterlyROIC: QuarterlyData[]
    
}
