import { Discount, SimpleDiscount } from "./ffs-discount/discount.typings"

export interface IDiscountService {
    save(discount: Discount): Promise<string>
    delete(cik: string): Promise<string>
    getBulkSimpleDiscounts(): Promise<SimpleDiscount[]>
}