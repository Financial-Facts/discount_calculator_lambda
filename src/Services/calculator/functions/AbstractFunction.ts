import { PeriodicData } from "@/resources/consumers/price-check-consumer/discount-manager/discount-manager.typings";

abstract class AbstractFunction {

    abstract calculate(input: any): Promise<PeriodicData[] | number> | PeriodicData[] | number;

}

export default AbstractFunction;