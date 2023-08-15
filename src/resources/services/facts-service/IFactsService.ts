import Facts from "@/resources/entities/facts/IFacts";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

export default interface FactsService {
    
    getFacts(cik: string): Promise<Facts>;
    getStickerPriceData(cik: string): Promise<StickerPriceData>;

}