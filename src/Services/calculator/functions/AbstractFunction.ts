import { PeriodicData } from "@/src/types";

abstract class AbstractFunction {

    abstract calculate(input: any): Promise<PeriodicData[] | number> | PeriodicData[] | number;

}

export default AbstractFunction;