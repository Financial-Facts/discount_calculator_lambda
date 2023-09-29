import HttpException from '@/utils/exceptions/HttpException';
import { JSDOM } from 'jsdom';
import ScrapeDataException from '@/utils/exceptions/ScrapeDataException';
import { benchmarkService, calculatorService } from '../../bootstrap';
import { BenchmarkRatioPrice } from './benchmark.typings';
import { QuarterlyData } from '@/resources/consumers/price-check-consumer/discount-manager/discount-manager.typings';

class BenchmarkService {

    benchmarkSourceUrl: string;
    benchmarkIndustryMapping: Record<string, number>;

    constructor(benchmarkSourceUrl: string) {
        this.benchmarkSourceUrl = benchmarkSourceUrl;
        this.benchmarkIndustryMapping = {};
        this.loadBenchmarkIndustryMap().then(() => {
            console.log('Benchmark industry map has been loaded!');
        });
    }

    public async getBenchmarkRatioPrice(cik: string, industry: string, data: QuarterlyData): Promise<BenchmarkRatioPrice> {
        const ttmRevenue = data.quarterlyRevenue.slice(-4).map(period => period.value).reduce((a, b) => a + b);
        const sharesOutstanding = data.quarterlyOutstandingShares.slice(-1)[0].value;
        const benchmarkPsRatio = await benchmarkService.fetchBenchmarkPsRatio(industry);
        const benchmarkRatioPrice = calculatorService.calculateBenchmarkRatioPrice({
            industry: industry,
            benchmarkPsRatio: benchmarkPsRatio,
            ttmRevenue: ttmRevenue,
            sharesOutstanding: sharesOutstanding
        });
        return {
            cik: cik,
            ratioPrice: benchmarkRatioPrice,
            input: {
                cik: cik,
                industry: industry,
                ttmRevenue: ttmRevenue,
                sharesOutstanding: sharesOutstanding,
                psBenchmarkRatio: benchmarkPsRatio
            }
        }
    }

    async fetchBenchmarkPsRatio(industry: string): Promise<number> {
        if (this.benchmarkIndustryMapping[industry] !== undefined) {
            console.log(`Industry '${industry}' exists in benchmark map...`);
            return this.benchmarkIndustryMapping[industry];
        }
        console.log(`Industry '${industry}' does not exist in benchmark map, returning default...`);
        return 1.69;
    }

    private async loadBenchmarkIndustryMap(): Promise<void> {
        return this.fetchPage()
            .then(async HTML => {
                return this.fetchFromWebOrCache(HTML)
                    .then(document => {
                        this.extractData(document);
                    });
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
            .replace('&amp;', '&')
            .replace(' - ', '—');
    }
}

export default BenchmarkService;