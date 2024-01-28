import AbstractFunction from "./AbstractFunction";


class BenchmarkRatioPriceFunction extends AbstractFunction {

    calculate(data: {
        benchmarkPsRatio: number,
        ttmRevenue: number,
        sharesOutstanding: number
    }): number {
        return (data.ttmRevenue / data.sharesOutstanding) * data.benchmarkPsRatio;
    }
    
}

export default BenchmarkRatioPriceFunction;