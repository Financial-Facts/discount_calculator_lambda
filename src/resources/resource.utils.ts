import { Discount, SimpleDiscount } from "@/services/discount/discount.typings";

export function checkDiscountIsOnSale(currentPrice: number, discount: Discount): boolean {
    return checkDiscountDataMeetsRequirements(currentPrice,
        discount.ttmPriceData.salePrice,
        discount.tfyPriceData.salePrice,
        discount.ttyPriceData.salePrice,
        discount.ratioPrice);
}

export function checkSimpleDiscountIsOnSale(currentPrice: number, discount: SimpleDiscount): boolean {
    return checkDiscountDataMeetsRequirements(currentPrice,
        discount.ttmSalePrice,
        discount.tfySalePrice,
        discount.ttySalePrice,
        discount.ratio_Price);
}

function checkDiscountDataMeetsRequirements(
    currentPrice: number,
    ttm: number,
    tfy: number,
    tty: number,
    ratioPrice?: number
): boolean {
    return currentPrice < ttm &&
        currentPrice < tfy &&
        currentPrice < tty &&
        (ratioPrice ? currentPrice < ratioPrice : true);
}