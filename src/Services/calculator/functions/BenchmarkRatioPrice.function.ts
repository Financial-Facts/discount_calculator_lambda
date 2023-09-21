import { benchmarkService } from "../../../bootstrap";
import { QuarterlyData } from "../../sticker-price/sticker-price.typings";
import AbstractFunction from "./AbstractFunction";


class BenchmarkRatioPriceFunction extends AbstractFunction {

    async calculate(data: {
        industry: string,
        quarterlyData: QuarterlyData
    }): Promise<number> {
        const ttmRevenue = data.quarterlyData.quarterlyRevenue.slice(-4).map(period => period.value).reduce((a, b) => a + b);
        const sharesOutstanding = data.quarterlyData.quarterlyOutstandingShares.slice(-1)[0].value;
        return benchmarkService.fetchBenchmarkPsRatio(data.industry)
            .then(benchmarkPsRatio => (ttmRevenue / sharesOutstanding) * benchmarkPsRatio);
    }
    
}

export default BenchmarkRatioPriceFunction;