import { BenchmarkRatioPriceInput } from "@/resources/discount-manager/discount-manager.typings";
import AbstractFunction from "./AbstractFunction";
import { benchmarkService } from "@/src/bootstrap";
import { BenchmarkRatioPrice } from "@/services/benchmark/benchmark.typings";
import { getLastPeriodValue, reduceTTM } from "@/resources/discount-manager/discount-manager.utils";


class BenchmarkRatioPriceFunction extends AbstractFunction {

    async calculate(data: {
        cik: string,
        industry: string,
        quarterlyData: BenchmarkRatioPriceInput
    }): Promise<BenchmarkRatioPrice> {
        const benchmarkPsRatio = await benchmarkService.fetchBenchmarkPsRatio(data.industry);
        const quarterlyData = data.quarterlyData;
        const ttmRevenue = reduceTTM(quarterlyData.quarterlyRevenue, (a, b) => a + b);
        const sharesOutstanding = getLastPeriodValue(quarterlyData.quarterlyOutstandingShares);
        const benchmarkRatioPrice = (ttmRevenue / sharesOutstanding) * benchmarkPsRatio;
        return {
            cik: data.cik,
            price: benchmarkRatioPrice,
            input: {
                cik: data.cik,
                industry: data.industry,
                ttmRevenue: ttmRevenue,
                sharesOutstanding: sharesOutstanding,
                psBenchmarkRatio: benchmarkPsRatio
            }
        };
    }
    
}

export default BenchmarkRatioPriceFunction;