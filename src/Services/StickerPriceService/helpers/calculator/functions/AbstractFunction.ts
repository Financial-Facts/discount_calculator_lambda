import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import { PeriodicData } from "@/resources/entities/models/PeriodicData";

abstract class AbstractFunction {

    abstract calculate(stickerPriceData: StickerPriceData): Promise<PeriodicData[]>;

}

export default AbstractFunction;