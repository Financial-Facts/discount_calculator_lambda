import Discount from "@/resources/entities/discount/IDiscount";
import Calculator from "./helpers/calculator/calculator";
import { historicalPriceService, statementService } from "../../bootstrap";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import Statements from "@/resources/entities/statements/statements";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import { PeriodicData } from "@/resources/entities/models/PeriodicData";

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
                        if (this.salePriceExceedsZero(discount) && 
                            this.anySalePriceExceedsValue(price, discount)) {
                                discount.active = true;
                        }
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
                return this.calculator.calculateStickerPriceData(data);
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

    private salePriceExceedsZero(discount: Discount): boolean {
        return discount.ttmPriceData.salePrice > 0 &&
                discount.tfyPriceData.salePrice > 0 &&
                discount.ttyPriceData.salePrice > 0;
    }
    
    private anySalePriceExceedsValue(value: number, discount: Discount): boolean {
        return discount.ttmPriceData.salePrice > value ||
                discount.tfyPriceData.salePrice > value || 
                discount.ttyPriceData.salePrice > value;
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
            })
        }
    }
}

export default StickerPriceService;