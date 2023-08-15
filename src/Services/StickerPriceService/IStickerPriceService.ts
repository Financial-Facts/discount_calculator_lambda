import Discount from "@/resources/entities/discount/IDiscount";

export default interface StickerPriceService {

    checkForSale(cik: string): Promise<Discount>;

}