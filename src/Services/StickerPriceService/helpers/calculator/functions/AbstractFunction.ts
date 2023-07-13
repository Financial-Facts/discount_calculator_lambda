import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import QuarterlyData from "@/resources/entities/models/QuarterlyData";

abstract class AbstractFunction {

    abstract calculate(stickerPriceData: StickerPriceData): Promise<QuarterlyData[]>;
    abstract annualize(cik: string, quarterlyData: QuarterlyData[]): QuarterlyData[];

}

export default AbstractFunction;