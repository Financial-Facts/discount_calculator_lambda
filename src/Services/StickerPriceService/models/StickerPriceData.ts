import PriceData from "Services/HistoricalPriceService/models/PriceData";

export default interface StickerPriceData {
    facts: any,
    h_data: PriceData[]
}