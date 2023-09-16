import StickerPriceData, { PeriodicData } from "../../../../../services/sticker-price/sticker-price.typings";

abstract class AbstractFunction {

    abstract calculate(stickerPriceData: StickerPriceData): Promise<PeriodicData[]>;

}

export default AbstractFunction;