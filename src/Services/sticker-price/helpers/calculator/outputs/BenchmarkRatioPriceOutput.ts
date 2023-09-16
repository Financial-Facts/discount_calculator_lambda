import AbstractOutput from "./AbstractOutput";

class BenchmarkRatioPriceOutput implements AbstractOutput {

    benchmarkPsRatio: number = 	1.69;

    public async submit(input: {
        ttmRevenue: number,
        sharesOutstanding: number
    }): Promise<number> {
        return (input.ttmRevenue / input.sharesOutstanding) * this.benchmarkPsRatio;
    }
}

export default BenchmarkRatioPriceOutput;