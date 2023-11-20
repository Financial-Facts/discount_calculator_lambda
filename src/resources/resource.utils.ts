import { Discount } from "@/services/discount/discount.typings";

export function removeS3KeySuffix(key: string): string {
    return key.slice(0, -5);
}

export async function sleep(millis: number): Promise<void> {
    return new Promise(f => setTimeout(f, millis));
}

export function checkDiscountIsOnSale(currentPrice: number, discount: Discount): boolean {
    return checkDiscountDataMeetsRequirements(currentPrice,
        discount.stickerPrice.ttyPriceData.salePrice,
        discount.benchmarkRatioPrice.ratioPrice);
}

function checkDiscountDataMeetsRequirements(
    currentPrice: number,
    tty: number,
    ratioPrice?: number
): boolean {
    return currentPrice < tty &&
        (ratioPrice ? currentPrice < ratioPrice : true);
}