import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { Discount } from "../discount/discount.typings";
import { CompanyProfile } from "../financial-modeling-prep/profile/profile.typings";
import { Statements } from "../financial-modeling-prep/statement/statement.typings";
import Calculator from "./calculator/calculator";
import { StickerPriceData, PeriodicData } from "./sticker-price.typings";
import { checkDiscountIsOnSale } from "./utils/disqualification.utils";
import { historicalPriceService, statementService, profileService } from "../../bootstrap";

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
        return Promise.all([
            statementService.getStatements(cik),
            profileService.getCompanyProfile(cik)
        ]).then(companyData => {
            const [ statements, profile ] = companyData;
            const data = this.buildStickerPriceData(cik, statements, profile);
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

    private buildStickerPriceData(cik: string, statements: Statements, profile: CompanyProfile): StickerPriceData {
        return {
            cik: cik,
            symbol: statements.balanceSheets[0].symbol,
            name: profile.companyName,
            industry: profile.industry,
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