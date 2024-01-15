import HttpException from "@/utils/exceptions/HttpException";
import { DiscountedCashFlowData, DiscountedCashFlowPrice } from "./discounted-cash-flow.typings";
import { calculatorService } from "@/src/bootstrap";
import { QuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { PeriodicData } from "@/src/types";
import { annualizeByAdd, getLastPeriodValue, reduceTTM } from "@/resources/discount-manager/discount-manager.utils";
import { addYears } from "@/utils/global.utils";


class DiscountedCashFlowService {

    private fmp_base_url;
    private apiKey;
    
    constructor(fmp_base_url: string, apiKey: string) {
        this.fmp_base_url = fmp_base_url;
        this.apiKey = apiKey;
    }

    async getDiscountCashFlowPrice(cik: string, symbol: string, quarterlyData: QuarterlyData): Promise<DiscountedCashFlowPrice> {
        return this.getDiscountedCashFlowData(symbol)
            .then(data => {
                const annualFreeCashFlow = annualizeByAdd(cik, quarterlyData.quarterlyFreeCashFlow);
                const projections = this.buildCashFlowProjections(cik, annualFreeCashFlow);

                const terminalValue = calculatorService.calculateTerminalValue({
                    wacc: data.wacc,
                    riskFreeRate: data.riskFreeRate,
                    ttmFreeCashFlow: getLastPeriodValue(annualFreeCashFlow)
                });

                const enterpriseValue = calculatorService.calculateEnterpriseValue({
                    wacc: data.wacc,
                    periodicData: {
                        periodicFreeCashFlow: projections
                    },
                    terminalValue: terminalValue
                });

                const dcfPrice = calculatorService.calculateDiscountedCashFlowPrice({
                    enterpriseValue: enterpriseValue,
                    totalCash: data.totalCash,
                    totalDebt: data.totalDebt,
                    dilutedSharesOutstanding: data.dilutedSharesOutstanding,
                });

                return {
                    cik: cik,
                    dcfPrice: dcfPrice,
                    input: {
                        freeCashFlowHistorical: quarterlyData.quarterlyFreeCashFlow,
                        freeCashFlowProjected: projections,
                        wacc: data.wacc,
                        riskFreeRate: data.riskFreeRate,
                        totalCash: data.totalCash,
                        totalDebt: data.totalDebt,
                        dilutedSharesOutstanding: data.dilutedSharesOutstanding,
                        terminalValue: terminalValue,
                        enterpriseValue: enterpriseValue
                    }
                }
            });
    }

    private async getDiscountedCashFlowData(symbol: string): Promise<DiscountedCashFlowData> {
        console.log(`In rate service getting discounted cash flow data`);
        try {
            const url = `${this.fmp_base_url}/api/v4/advanced_discounted_cash_flow?symbol=${symbol}&apikey=${this.apiKey}`;
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

    private buildCashFlowProjections(
        cik: string,
        annualFreeCashFlow: PeriodicData[]
    ): PeriodicData[] {
        const lastPeriodValue = getLastPeriodValue(annualFreeCashFlow);
        const projections: PeriodicData[] = [];
        for (let i = 0; i < 10; i++) {
            projections.push({
                cik: cik,
                announcedDate: addYears(annualFreeCashFlow[i].announcedDate, 11),
                period: annualFreeCashFlow[i].period,
                value: lastPeriodValue
            })
        }
        return projections;
    }
}

export default DiscountedCashFlowService;
