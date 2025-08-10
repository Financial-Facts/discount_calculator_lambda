import { Output } from "../calculator.typings";


export interface Function <T, J> {

    calculate(input: T): J;

}

export default Function;