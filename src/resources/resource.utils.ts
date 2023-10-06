import { Discount, SimpleDiscount } from "@/services/discount/discount.typings";

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