import HttpException from "@/utils/exceptions/HttpException";
import { DiscountedCashFlowData, DiscountedCashFlowInput, DiscountedCashFlowPrice } from "./discounted-cash-flow.typings";
import { calculatorService } from "@/src/bootstrap";
import { DiscountedCashFlowQuarterlyData, QuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { filterToCompleteFiscalYears } from "@/utils/filtering.utils";
import { annualizeByAdd } from "@/utils/annualize.utils";
import { processPeriodicDatasets, getLastPeriodValue } from "@/utils/processing.utils";
import { projectByAverageGrowth, projectByAveragePercentOfValue } from "@/utils/projection.utils";
import { PeriodicData } from "@/src/types";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { discountedCashFlowFunction, enterpriseValueFunction, terminalValueFunction, waccFunction } from "@/services/calculator/calculator.service";


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
        totalDebt: number,
        netDebt: number,
        quarterlyData: DiscountedCashFlowQuarterlyData
    ): Promise<DiscountedCashFlowInput> {
        const historicalNumYears = 5;
        const [
            historicalRevenue,
            projectedRevenue,
            historicalOperatingCashFlow,
            projectedOperatingCashFlow,
            historicalCapitalExpenditure,
            projectedCapitalExpenditure,
            historicalFreeCashFlow,
            projectedFreeCashFlow
        ] = this.buildPeriodicProjections(cik, historicalNumYears, quarterlyData);
        return this.getDiscountedCashFlowData(symbols).then(data => {
            const [
                wacc,
                freeCashFlowT1,
                terminalValue,
                enterpriseValue
            ] = this.calculateFinancialValues(cik, totalDebt, projectedFreeCashFlow, data);
            return {
                cik: cik,
                symbol: activeSymbol,
                longTermGrowthRate: data.longTermGrowthRate,
                freeCashFlowT1: freeCashFlowT1,
                wacc: wacc,
                terminalValue: terminalValue,
                enterpriseValue: enterpriseValue,
                netDebt: netDebt,
                dilutedSharesOutstanding: data.dilutedSharesOutstanding,
                marketPrice: data.price,
                historicalRevenue: historicalRevenue,
                projectedRevenue: projectedRevenue,
                historicalOperatingCashFlow: historicalOperatingCashFlow,
                projectedOperatingCashFlow: projectedOperatingCashFlow,
                historicalCapitalExpenditure: historicalCapitalExpenditure,
                projectedCapitalExpenditure: projectedCapitalExpenditure,
                historicalFreeCashFlow: historicalFreeCashFlow,
                projectedFreeCashFlow: projectedFreeCashFlow
            }
        });
    }

    private buildPeriodicProjections(
        cik: string,
        historicalNumYears: number,
        quarterlyData: DiscountedCashFlowQuarterlyData
    ): PeriodicData[][] {
        const filteredQuarterlyRevenue = filterToCompleteFiscalYears(quarterlyData.quarterlyRevenue);
        const filteredQuarterlyOperatingCashFlow = filterToCompleteFiscalYears(quarterlyData.quarterlyOperatingCashFlow);
        const filteredQuarterlyCapitalExpenditure = filterToCompleteFiscalYears(quarterlyData.quarterlyCapitalExpenditure);

        const historicalRevenue = annualizeByAdd(cik, filteredQuarterlyRevenue);
        const projectedRevenue = projectByAverageGrowth(cik, 5, historicalRevenue);
    
        const historicalOperatingCashFlow = annualizeByAdd(cik, filteredQuarterlyOperatingCashFlow);
        const projectedOperatingCashFlow = projectByAveragePercentOfValue(cik,
            historicalOperatingCashFlow.slice(-historicalNumYears),
            historicalRevenue.slice(-historicalNumYears),
            projectedRevenue);
    
        const historicalCapitalExpenditure = annualizeByAdd(cik, filteredQuarterlyCapitalExpenditure);
        const projectedCapitalExpenditure = projectByAveragePercentOfValue(cik,
            historicalCapitalExpenditure.slice(-historicalNumYears),
            historicalRevenue.slice(-historicalNumYears),
            projectedRevenue);

        const historicalFreeCashFlow = processPeriodicDatasets(cik,
            historicalOperatingCashFlow,
            historicalCapitalExpenditure, (a, b) => a + b);
        const projectedFreeCashFlow = processPeriodicDatasets(cik,
            projectedOperatingCashFlow,
            projectedCapitalExpenditure, (a, b) => a + b)

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

    private async getDiscountedCashFlowData(symbols: string[]): Promise<DiscountedCashFlowData> {

        const hasRequiredValues = (data: DiscountedCashFlowData): boolean => 
            !!data && !!data.longTermGrowthRate && !!data.dilutedSharesOutstanding && !!data.price &&
            !!data.totalEquity && !!data.costOfEquity && !!data.costofDebt && data.taxRate !== undefined;

        for (const symbol of symbols) {
            const data: DiscountedCashFlowData = await this.fetchDiscountedCashFlowData(symbol);
            if (hasRequiredValues(data)) {
                return data;
            }

            const retriedData = await this.fetchDiscountedCashFlowData(symbol, true);
            if (hasRequiredValues(retriedData)) {
                return retriedData;
            }
        }

        throw new InsufficientDataException(`Insufficient discounted cash flow data available for ${symbols}`);
    }

    private async fetchDiscountedCashFlowData(symbol: string, isRetry = false): Promise<DiscountedCashFlowData> {
        console.log(`In discounted cash flow service getting discounted cash flow data`);
        try {
            const endpointVal = isRetry ? 'advanced_discounted_cash_flow' : 'advanced_levered_discounted_cash_flow';
            const url = `${this.fmp_base_url}/api/v4/${endpointVal}?symbol=${symbol}&apikey=${this.apiKey}`;
            return fetch(url)
                .then(async (response: Response) => {
                    if (response.status !== 200) {
                        const text = await response.text();
                        throw new HttpException(response.status,
                            `Error occurred while getting discounted cash flow data: ${text}`);
                    }
                    return response.json();
                }).then((body: DiscountedCashFlowData[]) => {
                    return body[0];
                });
        } catch (err: any) {
            throw new HttpException(err.status,
                `Error occurred while getting getting discounted cash flow data: ${err.message}`)
        }
    }

    
}

export default DiscountedCashFlowService;
