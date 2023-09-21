import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { DiscountInput, PeriodicData } from "../sticker-price.typings";

   
export function checkHasSufficientStickerPriceData(data: DiscountInput): void {
    checkHasSufficientPeriodicData(data.quarterlyEPS, 'EPS');
    checkHasSufficientPeriodicData(data.quarterlyOutstandingShares, 'Outstanding Shares');
    checkHasSufficientPeriodicData(data.quarterlyShareholderEquity, 'Shareholder Equity');
}

function checkHasSufficientPeriodicData(data: PeriodicData[], type: string): void {
    if (data.length !== 44) {
        throw new InsufficientDataException(`Insufficent sticker price data value: ${type}`);
    }
}