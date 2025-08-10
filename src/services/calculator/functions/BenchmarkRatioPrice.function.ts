import Function from "./Function";


export interface BenchmarkRatioPriceVariables {
    benchmarkPsRatio: number,
    ttmRevenue: number,
    sharesOutstanding: number
}

class BenchmarkRatioPriceFunction implements Function<BenchmarkRatioPriceVariables, number> {

    calculate(variables: BenchmarkRatioPriceVariables): number {
        return (variables.ttmRevenue / variables.sharesOutstanding) * variables.benchmarkPsRatio;
    }
    
}

export default BenchmarkRatioPriceFunction;