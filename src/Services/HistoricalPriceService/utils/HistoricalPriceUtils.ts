import Identity from "@/resources/entities/Identity";
import { Frequency } from "../models/Frequency";
import HistoricalPriceInput from "../models/HistoricalPriceInput";

export function buildHistoricalPriceInput(identity: Identity, fromDate: Date, toDate: Date): HistoricalPriceInput {
    return {
        symbol: identity.symbol,
        fromDate: fromDate,
        toDate: toDate,
        frequency: Frequency.DAILY
    }
}