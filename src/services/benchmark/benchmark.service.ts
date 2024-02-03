import HttpException from '@/utils/exceptions/HttpException';
import { JSDOM } from 'jsdom';
import ScrapeDataException from '@/utils/exceptions/ScrapeDataException';
import { calculatorService } from '../../bootstrap';
import { BenchmarkRatioPriceInput, BenchmarkRatioPrice } from './benchmark.typings';
import { BenchmarkRatioPriceQuarterlyData, QuarterlyData } from '@/resources/discount-manager/discount-manager.typings';
import { reduceTTM, getLastPeriodValue } from '@/utils/processing.utils';

class BenchmarkService {

    benchmarkSourceUrl: string;
    benchmarkIndustryMapping: Record<string, number>;
    isReady: Promise<void>;

    constructor(benchmarkSourceUrl: string) {
        this.benchmarkSourceUrl = benchmarkSourceUrl;
        this.benchmarkIndustryMapping = {};
        this.isReady = this.loadBenchmarkIndustryMap();
    }

    public getBenchmarkRatioPrice(cik: string, input: BenchmarkRatioPriceInput): BenchmarkRatioPrice {
        console.log(`In benchmark service fetching benchmark ratio price for ${cik}`);
        return {
            cik: cik,
            price: calculatorService.calculateBenchmarkRatioPrice({
                benchmarkPsRatio: input.psBenchmarkRatio,
                ttmRevenue: input.ttmRevenue,
                sharesOutstanding: input.sharesOutstanding
            }),
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
        return this.isReady.then(() => {
            if (this.benchmarkIndustryMapping[industry] !== undefined) {
                console.log(`Industry '${industry}' exists in benchmark map...`);
                return this.benchmarkIndustryMapping[industry];
            }
            console.log(`Industry '${industry}' does not exist in benchmark map, returning default...`);
            return 1.69;
        });
    }

    private async loadBenchmarkIndustryMap(): Promise<void> {
        return this.fetchPage()
            .then(async HTML => {
                return this.fetchFromWebOrCache(HTML)
                    .then(document => {
                        this.extractData(document);
                    });
            }).finally(() => {
                console.log('Benchmark industry map has been loaded!');
            });
    }

    private async fetchPage(): Promise<string> {
        try {
            return fetch(this.benchmarkSourceUrl)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while fetching benchmark page: ${text}`);
                    }
                    return response.text();
                }).then((body: string) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while fetching benchmark page: ${err.message}`)
        }
    }

    private async fetchFromWebOrCache(HTML: string): Promise<Document> {
        const dom = new JSDOM(HTML);
        return dom.window.document;
    }

    private extractData(document: Document): void {
        const benchmarkTable: HTMLTableElement | null
            = document.querySelector('#market-analysis-page > table:nth-child(12)');
        if (!benchmarkTable) {
            throw new ScrapeDataException('Industry benchmark table not found');
        }
        const tableData = Array.from(benchmarkTable.children[0].children).slice(1);
        tableData.forEach(tr => {
            const industry = this.cleanIndustryText(tr.children[0].innerHTML);
            const benchmarkRatio = +tr.children[1].innerHTML;
            this.benchmarkIndustryMapping[industry] = benchmarkRatio;
        })
    }

    private cleanIndustryText(industry: string): string {
        return industry
            .replaceAll('&amp;', '&')
            .replaceAll(' - ', '—');
    }
}

export default BenchmarkService;