import Discount from "@/resources/entities/discount/IDiscount";
import SimpleDiscount from "@/resources/entities/discount/ISimpleDiscount";

export default interface DiscountService {

    getDiscountWithCik(cik: string): Promise<Discount>;
    deleteDiscount(cik: string): Promise<string>;
    getBulkSimpleDiscounts(): Promise<SimpleDiscount[]>;
    submitBulkDiscountStatusUpdate(discountUpdateMap: Record<string, boolean>): Promise<string[]>;
    saveDiscount(discount: Discount): Promise<string>;

}