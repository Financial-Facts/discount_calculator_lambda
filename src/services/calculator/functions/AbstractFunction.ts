import { Output } from "../calculator.typings";

abstract class AbstractFunction {

    abstract calculate(input: any): Output | Promise<Output>;

}

export default AbstractFunction;