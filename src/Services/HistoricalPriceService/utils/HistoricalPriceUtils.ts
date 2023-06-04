import Identity from "@/resources/identity/models/Identity";
import { Frequency } from "../models/Frequency";
import HistoricalPriceInput from "../models/HistoricalPriceInput";

export function buildHistoricalPriceInput(identity: Identity): HistoricalPriceInput {
    return {
        symbol: identity.symbol,
        fromDate: buildFromDate(),
        toDate: new Date(),
        frequency: Frequency.DAILY
    }
}

function buildFromDate(): Date {
    const date: Date = new Date();
    date.setFullYear(date.getFullYear() - 15);
    return date;
}