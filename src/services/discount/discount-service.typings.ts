import { Discount, IndustryPSBenchmarkRatio, SimpleDiscount } from "./ffs-discount/discount.typings"

export interface IDiscountService {
    save(discount: Discount): Promise<string>
    delete(cik: string, reason?: string): Promise<string>
    getBulkSimpleDiscounts(): Promise<SimpleDiscount[]>
    getIndustryPSBenchmarkRatio(industry: string): Promise<IndustryPSBenchmarkRatio | null>
    upsertIndustryPSBenchmarkRatio(industry: string, ps_ratio: number): Promise<string>
}