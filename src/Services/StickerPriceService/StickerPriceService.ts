import Discount from "@/resources/entities/discount/IDiscount";
import Calculator from "./helpers/calculator/calculator";
import { historicalPriceService, statementService } from "../../bootstrap";
import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import Statements from "@/resources/entities/statements/statements";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";

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
        this.checkHasSufficientQuarterlyData(data.quarterlyEPS, 'EPS');
        this.checkHasSufficientQuarterlyData(data.quarterlyLongTermDebt, 'Long Term debt');
        this.checkHasSufficientQuarterlyData(data.quarterlyNetIncome, 'Net Income');
        this.checkHasSufficientQuarterlyData(data.quarterlyOutstandingShares, 'Outstanding Shares');
        this.checkHasSufficientQuarterlyData(data.quarterlyShareholderEquity, 'Shareholder Equity');
    }

    private checkHasSufficientQuarterlyData(data: QuarterlyData[], type: string): void {
        if (data.length < 40) {
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
                    value: sheets.totalStockholdersEquity
                }
            }),
            quarterlyOutstandingShares: statements.incomeStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    value: sheets.weightedAverageShsOut
                }
            }),
            quarterlyLongTermDebt: statements.balanceSheets.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    value: sheets.longTermDebt
                }
            }),
            quarterlyEPS: statements.incomeStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    value: sheets.eps
                }
            }),
            quarterlyNetIncome: statements.incomeStatements.map(sheets => {
                return {
                    cik: sheets.cik,
                    announcedDate: sheets.date,
                    value: sheets.netIncome
                }
            }),
        }
    }
}

export default StickerPriceService;