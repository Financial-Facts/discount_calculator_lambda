import { PeriodicData } from "../../sticker-price/sticker-price.typings";

abstract class AbstractFunction {

    abstract calculate(input: any): Promise<PeriodicData[] | number> | PeriodicData[] | number;

}

export default AbstractFunction;