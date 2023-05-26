abstract class AbstractFunction {
    
    abstract calculate(): number[];
    abstract setVariables(): void;
    abstract annualize(): { firstQuarter: number[], annualBVPS: number[] };

}

export default AbstractFunction;