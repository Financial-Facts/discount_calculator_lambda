import { calculatorService } from '../../bootstrap';
import { BenchmarkRatioPriceInput, BenchmarkRatioPrice } from './benchmark.typings';
import { BenchmarkRatioPriceQuarterlyData } from '@/resources/discount-manager/discount-manager.typings';
import { reduceTTM, getLastPeriodValue } from '@/utils/processing.utils';
import { benchmarkIndustryMapping, industryNameMap } from './benchmark.constants';
import { benchmarkRatioPriceFunction } from '../calculator/calculator.service';

class BenchmarkService {

    benchmarkSourceUrl: string;

    constructor(benchmarkSourceUrl: string) {
        this.benchmarkSourceUrl = benchmarkSourceUrl;
    }

    public getBenchmarkRatioPrice(cik: string, input: BenchmarkRatioPriceInput): BenchmarkRatioPrice {
        console.log(`In benchmark service fetching benchmark ratio price for ${cik}`);
        return {
            cik: cik,
            price: calculatorService.calculate(
                {
                    benchmarkPsRatio: input.psBenchmarkRatio,
                    ttmRevenue: input.ttmRevenue,
                    sharesOutstanding: input.sharesOutstanding
                },
                benchmarkRatioPriceFunction
            ),
            input: input
        }
    }

    public async buildBenchmarkRatioPriceInput(
        cik: string,
        industry: string,
        quarterlyData: BenchmarkRatioPriceQuarterlyData
    ): Promise<BenchmarkRatioPriceInput> {
        const benchmarkPsRatio = await this.fetchBenchmarkPsRatio(industry);
        const ttmRevenue = reduceTTM(quarterlyData.quarterlyRevenue, (a, b) => a + b);
        const sharesOutstanding = getLastPeriodValue(quarterlyData.quarterlyOutstandingShares);

        return {
            cik: cik,
            industry: industry,
            psBenchmarkRatio: benchmarkPsRatio,
            ttmRevenue: ttmRevenue,
            sharesOutstanding: sharesOutstanding
        };
    }

    private async fetchBenchmarkPsRatio(industry: string): Promise<number> {
        let mapping = benchmarkIndustryMapping.find(obj => obj.Industry === industry);
        if (!!mapping) {
            console.log(`Industry '${industry}' exists in benchmark map...`);
            return +mapping['Average P/S ratio'];
        }

        const removedDash = ('' + industry).replaceAll(' - ', ' ');
        mapping = benchmarkIndustryMapping.find(obj => obj.Industry === removedDash);
        if (!!mapping) {
            console.log(`Industry '${industry}' exists in benchmark map...`);
            return +mapping['Average P/S ratio'];
        }

        if (industry in industryNameMap) {
            
            mapping = benchmarkIndustryMapping.find(obj => obj.Industry === industryNameMap[industry]);

            if (!!mapping) {
                console.log(`Industry '${industry}' exists in industry name map...`);
                return +mapping['Average P/S ratio'];
            }
        }

        console.log(`Industry '${industry}' does not exist in benchmark map, returning default...`);
        return 1.69;
    }
}

export default BenchmarkService;