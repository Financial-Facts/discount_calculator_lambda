import HttpException from "@/utils/exceptions/HttpException";
import { DiscountedCashFlowData, DiscountedCashFlowInput, DiscountedCashFlowPrice } from "./discounted-cash-flow.typings";
import { calculatorService } from "@/src/bootstrap";
import { DiscountedCashFlowQuarterlyData, QuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { filterToCompleteFiscalYears } from "@/utils/filtering.utils";
import { annualizeByAdd } from "@/utils/annualize.utils";
import { processPeriodicDatasets, getLastPeriodValue } from "@/utils/processing.utils";
import { PeriodicData } from "@/src/types";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { discountedCashFlowFunction, enterpriseValueFunction, terminalValueFunction, waccFunction } from "@/services/calculator/calculator.service";
import { addYears } from "@/utils/date.utils";


class DiscountedCashFlowService {

    private fmp_base_url;
    private apiKey;
    
    constructor(fmp_base_url: string, apiKey: string) {
        this.fmp_base_url = fmp_base_url;
        this.apiKey = apiKey;
    }

    public getDiscountCashFlowPrice(
        cik: string,
        input: DiscountedCashFlowInput
    ): DiscountedCashFlowPrice {
        console.log(`In discounted cash flow service getting DCF price for ${cik}`);
        return {
            cik: cik,
            price: calculatorService.calculate(
                {
                    enterpriseValue: input.enterpriseValue,
                    netDebt: input.netDebt,
                    dilutedSharesOutstanding: input.dilutedSharesOutstanding
                },
                discountedCashFlowFunction
            ),
            input: input
        }
    }

    public async buildDiscountedCashFlowInput(
        cik: string,
        activeSymbol: string,
        symbols: string[],
        quarterlyData: DiscountedCashFlowQuarterlyData
    ): Promise<DiscountedCashFlowInput> {
        const data = await this.getDiscountedCashFlowData(symbols)

        const [
            historicalRevenue,
            projectedRevenue,
            historicalOperatingCashFlow,
            projectedOperatingCashFlow,
            historicalCapitalExpenditure,
            projectedCapitalExpenditure,
            historicalFreeCashFlow,
            projectedFreeCashFlow
        ] = this.buildPeriodicProjections(
            cik,
            quarterlyData,
            data
        );

        const [
            wacc,
            freeCashFlowT1,
            terminalValue,
            enterpriseValue
        ] = this.calculateFinancialValues(cik, data[0].totalDebt, projectedFreeCashFlow, data[0]);

        return {
            cik: cik,
            symbol: activeSymbol,
            longTermGrowthRate: data[0].longTermGrowthRate,
            freeCashFlowT1: freeCashFlowT1,
            wacc: wacc,
            terminalValue: terminalValue,
            enterpriseValue: enterpriseValue,
            netDebt: data[0].netDebt,
            dilutedSharesOutstanding: data[0].dilutedSharesOutstanding,
            marketPrice: data[0].price,
            historicalRevenue: historicalRevenue,
            projectedRevenue: projectedRevenue,
            historicalOperatingCashFlow: historicalOperatingCashFlow,
            projectedOperatingCashFlow: projectedOperatingCashFlow,
            historicalCapitalExpenditure: historicalCapitalExpenditure,
            projectedCapitalExpenditure: projectedCapitalExpenditure,
            historicalFreeCashFlow: historicalFreeCashFlow,
            projectedFreeCashFlow: projectedFreeCashFlow
        };
    }

    private buildPeriodicProjections(
        cik: string,
        quarterlyData: DiscountedCashFlowQuarterlyData,
        data: DiscountedCashFlowData[]
    ): PeriodicData[][] {
        // Filter quarterly data to ensure we are only projecting based on complete fiscal years
        const filteredQuarterlyRevenue = filterToCompleteFiscalYears(quarterlyData.quarterlyRevenue);
        const filteredQuarterlyOperatingCashFlow = filterToCompleteFiscalYears(quarterlyData.quarterlyOperatingCashFlow);
        const filteredQuarterlyCapitalExpenditure = filterToCompleteFiscalYears(quarterlyData.quarterlyCapitalExpenditure);

        // Annualize quarterly data by adding values from the 4 quarters in each fiscal year
        const historicalRevenue = annualizeByAdd(cik, filteredQuarterlyRevenue);
        const historicalOperatingCashFlow = annualizeByAdd(cik, filteredQuarterlyOperatingCashFlow);
        const historicalCapitalExpenditure = annualizeByAdd(cik, filteredQuarterlyCapitalExpenditure);
        const historicalFreeCashFlow = processPeriodicDatasets(
            cik,
            historicalOperatingCashFlow,
            historicalCapitalExpenditure,
            (a, b) => a + b
        );

        // Project future values
        const lastHistoricalDate = new Date(historicalRevenue.slice(-1)[0].announcedDate);
        const projections = data.filter(d => Number(d.year) > lastHistoricalDate.getFullYear()).reverse();
        const projectedRevenue: PeriodicData[] = projections.map((projection, i) => ({
            cik: cik,
            announcedDate: addYears(lastHistoricalDate, i + 1),
            period: 'Q4',
            value: projection.revenue
        }));

        const projectedOperatingCashFlow: PeriodicData[] = projections.map((projection, i) => ({
            cik: cik,
            announcedDate: addYears(lastHistoricalDate, i + 1),
            period: 'Q4',
            value: projection.operatingCashFlow
        }));
    
        const projectedCapitalExpenditure: PeriodicData[] = projections.map((projection, i) => ({
            cik: cik,
            announcedDate: addYears(lastHistoricalDate, i + 1),
            period: 'Q4',
            value: projection.capitalExpenditure
        }));

        const projectedFreeCashFlow: PeriodicData[] = projections.map((projection, i) => ({
            cik: cik,
            announcedDate: addYears(lastHistoricalDate, i + 1),
            period: 'Q4',
            value: projection.freeCashFlow
        }));

        return [
            historicalRevenue,
            projectedRevenue,
            historicalOperatingCashFlow,
            projectedOperatingCashFlow,
            historicalCapitalExpenditure,
            projectedCapitalExpenditure,
            historicalFreeCashFlow,
            projectedFreeCashFlow
        ]
    }

    private calculateFinancialValues(
        cik: string,
        totalDebt: number,
        projectedFreeCashFlow: PeriodicData[],
        data: DiscountedCashFlowData
    ): number[] {
        
        const wacc = calculatorService.calculate(
            {
                cik: cik, 
                ...data,
                totalDebt: totalDebt,
            },
            waccFunction
        );

        const lastPeriodFreeCashFlow = getLastPeriodValue(projectedFreeCashFlow);
        const freeCashFlowT1 = lastPeriodFreeCashFlow + (lastPeriodFreeCashFlow * (data.longTermGrowthRate / 100));

        const terminalValue = calculatorService.calculate(
            {
                wacc: wacc,
                longTermGrowthRate: data.longTermGrowthRate,
                freeCashFlowT1: freeCashFlowT1
            },
            terminalValueFunction
        );

        const enterpriseValue = calculatorService.calculate(
            {
                wacc: wacc,
                terminalValue: terminalValue,
                periodicData: {
                    periodicFreeCashFlow: projectedFreeCashFlow
                }
            },
            enterpriseValueFunction
        );

        return [
            wacc,
            freeCashFlowT1,
            terminalValue,
            enterpriseValue
        ]
    }

    private async getDiscountedCashFlowData(symbols: string[]): Promise<DiscountedCashFlowData[]> {

        const hasRequiredValues = (data: DiscountedCashFlowData[]): boolean => 
            !!data[0] && !!data[0].longTermGrowthRate && !!data[0].dilutedSharesOutstanding && !!data[0].price &&
            !!data[0].totalEquity && !!data[0].costOfEquity && !!data[0].costofDebt && data[0].taxRate !== undefined;

        for (const symbol of symbols) {
            const data = await this.fetchDiscountedCashFlowData(symbol);
            if (hasRequiredValues(data)) {
                return data;
            }
        }

        throw new InsufficientDataException(`Insufficient discounted cash flow data available for ${symbols}`);
    }

    private async fetchDiscountedCashFlowData(symbol: string): Promise<DiscountedCashFlowData[]> {
        console.log(`In discounted cash flow service getting discounted cash flow data`);
        try {
            const url = `${this.fmp_base_url}/api/v4/advanced_levered_discounted_cash_flow?symbol=${symbol}&apikey=${this.apiKey}`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting discounted cash flow data: ${text}`);
                    }
                    return response.json();
                }).then((body: DiscountedCashFlowData[]) => {
                    return body;
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting getting discounted cash flow data: ${err.message}`)
        }
    }

    
}

export default DiscountedCashFlowService;
