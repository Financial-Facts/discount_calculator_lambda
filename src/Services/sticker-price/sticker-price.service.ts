import Calculator from "./helpers/calculator/calculator";
import { historicalPriceService, statementService } from "../../bootstrap";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { checkDiscountIsOnSale } from "./utils/disqualification.utils";
import { Discount } from "../../services/discount/discount.typings";
import { Statements } from "../../services/statement/statement.typings";
import StickerPriceData, { PeriodicData } from "./sticker-price.typings";

class StickerPriceService {

    private calculator: Calculator;

    constructor() {
        this.calculator = new Calculator();
    }

    public async checkForSale(cik: string): Promise<Discount> {
        return this.getStickerPriceDiscount(cik)
            .then(async (discount: Discount) => {
                return historicalPriceService.getCurrentPrice(discount.symbol)
                    .then(async (price: number) => {
                        discount.active = checkDiscountIsOnSale(price, discount);
                        return discount;
                    });
            });
    }

    private async getStickerPriceDiscount(cik: string): Promise<Discount> {
        console.log("In sticker price service getting discount data for cik: " + cik);
        return statementService.getStatements(cik)
            .then(async (statements: Statements) => {
                const data = this.buildStickerPriceData(cik, statements);
                this.checkHasSufficientStickerPriceData(data);
                return this.calculator.calculateDiscount(data);
            });
    }
    
    private checkHasSufficientStickerPriceData(data: StickerPriceData): void {
        this.checkHasSufficientPeriodicData(data.quarterlyEPS, 'EPS');
        this.checkHasSufficientPeriodicData(data.quarterlyOutstandingShares, 'Outstanding Shares');
        this.checkHasSufficientPeriodicData(data.quarterlyShareholderEquity, 'Shareholder Equity');
    }

    private checkHasSufficientPeriodicData(data: PeriodicData[], type: string): void {
        if (data.length !== 44) {
            throw new InsufficientDataException(`Insufficent sticker price data value: ${type}`);
        }
    }

    private buildStickerPriceData(cik: string, statements: Statements): StickerPriceData {
        return {
            cik: cik,
            symbol: statements.balanceSheets[0].symbol,
            name: statements.balanceSheets[0].symbol,
            benchmarkRatioPrice: 0,
            quarterlyShareholderEquity: statements.balanceSheets.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.totalStockholdersEquity
                }
            }),
            quarterlyOutstandingShares: statements.incomeStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.weightedAverageShsOut
                }
            }),
            quarterlyEPS: statements.incomeStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.eps
                }
            }),
            quarterlyOperatingIncome: statements.incomeStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.operatingIncome
                }
            }),
            quarterlyTaxExpense: statements.incomeStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.incomeTaxExpense
                }
            }),
            quarterlyNetDebt: statements.balanceSheets.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.netDebt
                }
            }),
            quarterlyTotalEquity: statements.balanceSheets.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.totalEquity
                }
            }),
            quarterlyRevenue: statements.incomeStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.revenue
                }
            }),
            quarterlyOperatingCashFlow: statements.cashFlowStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.operatingCashFlow
                }
            }),
            quarterlyFreeCashFlow: statements.cashFlowStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    period: sheets.period,
                    value: sheets.freeCashFlow
                }
            })
        }
    }
}

export default StickerPriceService;