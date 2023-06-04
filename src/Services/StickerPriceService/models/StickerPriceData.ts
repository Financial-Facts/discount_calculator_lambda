import Identity from "@/resources/identity/models/Identity";
import PriceData from "../../../Services/HistoricalPriceService/models/PriceData";

export default interface StickerPriceData {
    identity: Identity,
    facts: any
}