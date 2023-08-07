import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import QuarterlyData from "@/resources/entities/models/QuarterlyData";

export default interface StickerPriceInput {
    data: StickerPriceData
    growthRates: Record<number, number>,
    annualPE: QuarterlyData[],
    annualBVPS: QuarterlyData[],
    annualROIC: QuarterlyData[],
    annualEPS: QuarterlyData[],
    analystGrowthEstimate: number
}