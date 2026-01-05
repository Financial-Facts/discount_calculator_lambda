import { calculatorService, companyInformationService, discountService } from '../../bootstrap';
import { BenchmarkRatioPriceInput, BenchmarkRatioPrice } from './benchmark.typings';
import { BenchmarkRatioPriceQuarterlyData } from '@/resources/discount-manager/discount-manager.typings';
import { reduceTTM, getLastPeriodValue } from '@/utils/processing.utils';
import { benchmarkRatioPriceFunction } from '../calculator/calculator.service';
import { sleep } from '@/resources/resource.utils';
import { days_between } from '@/utils/date.utils';

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
        let benchmarkPsRatio;

        const storedBenchmarkRatioRow = await discountService.getIndustryPSBenchmarkRatio(industry);
        if (!!storedBenchmarkRatioRow) {
            const daysSinceUpdate = days_between(new Date(storedBenchmarkRatioRow.updated_at), new Date());
            if (daysSinceUpdate < 30) {
                console.log(`Using stored benchmark PS ratio for industry '${industry}'`);
                benchmarkPsRatio = storedBenchmarkRatioRow.ps_ratio;
            }
        }

        if (benchmarkPsRatio === undefined) {
            benchmarkPsRatio = await this.fetchBenchmarkPsRatio(industry);
            await discountService.upsertIndustryPSBenchmarkRatio(industry, benchmarkPsRatio);
        }

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
        const companyList = await companyInformationService.getCompanyListByIndustry(industry);

        const psValues: number[] = [];
        for (const company of companyList) {
            console.log(`Fetching PS ratio for company ${company.symbol} in industry '${industry}'`);
            const ttmRatios = await companyInformationService.getCompanyTTMRatiosBySymbol(company.symbol);
            if (ttmRatios && ttmRatios.priceToSalesRatioTTM) {
                psValues.push(ttmRatios.priceToSalesRatioTTM);
            }

            await sleep(500); // To avoid rate limiting
        }
        
        // If there are no PS values found, return a default value
        if (psValues.length === 0) {
            console.log(`Industry '${industry}' did not have any companies, returning default...`);
            return 1.69;
        }

        psValues.sort((a, b) => a - b);
        const median = psValues[Math.floor(psValues.length / 2)]; // median
        return median;
    }
}

export default BenchmarkService;