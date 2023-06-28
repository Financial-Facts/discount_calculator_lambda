import Identity from "../Identity"
import QuarterlyData from "../models/QuarterlyData"

export default interface StickerPriceData {

    identity: Identity
    quarterlyShareholderEquity: QuarterlyData[]
    quarterlyOutstandingShares: QuarterlyData[]
    quarterlyEPS: QuarterlyData[]
    quarterlyLongTermDebt: QuarterlyData[]
    
}