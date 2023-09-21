import { DiscountInput, PeriodicData, StickerPrice, TrailingPriceData } from "./sticker-price.typings";
import { checkBigFiveExceedGrowthRateMinimum } from "./utils/disqualification.utils";
import { calculatorService } from "../../bootstrap";
import { checkHasSufficientStickerPriceData } from "./utils/validation.utils";
import { annualizeByAdd, annualizeByLastQuarter } from "./utils/periodic-data.utils";
import { BigFive } from "../calculator/calculator.typings";

class StickerPriceService {

    public async getStickerPriceObject(
        cik: string,
        data: DiscountInput
    ): Promise<StickerPrice> {
        console.log("In sticker price service getting discount data for cik: " + cik);
        checkHasSufficientStickerPriceData(data);
        return this.calculateStickerPriceObject(data);
    }

    private async calculateStickerPriceObject(data: DiscountInput): Promise<StickerPrice> {
        console.log("In calculator calculating sticker price for CIK: " + data.cik);
        const annualEPS = annualizeByAdd(data.cik, data.quarterlyEPS);
        const annualBVPS = this.calculateAnnualBVPS(data);
        const annualPE = await this.calculateAnnualPE(data);
        const bigFive = this.calculateBigFive(data, annualEPS);
        checkBigFiveExceedGrowthRateMinimum(data.cik, bigFive);
        const [ ttmPriceData, tfyPriceData, ttyPriceData ] =
            this.calculateTrailingPriceData(data.cik, annualBVPS, annualPE, annualEPS);
        return {
            cik: data.cik,
            symbol: data.symbol,
            name: data.name,
            active: false,
            lastUpdated: new Date(),
            ttmPriceData: ttmPriceData,
            tfyPriceData: tfyPriceData,
            ttyPriceData: ttyPriceData,
            quarterlyBVPS: annualBVPS,
            quarterlyPE: annualPE,
            quarterlyEPS: bigFive.annualEPS,
            quarterlyROIC: bigFive.annualROIC
        }
    }

    private calculateAnnualBVPS(data: DiscountInput): PeriodicData[] {
        return calculatorService.calculateBVPS({
            cik: data.cik,
            timePeriod: 'A',
            quarterlyData: data
        });
    }

    private async calculateAnnualPE(data: DiscountInput): Promise<PeriodicData[]> {
        return calculatorService.calculatePE({
            cik: data.cik,
            timePeriod: 'A',
            symbol: data.symbol,
            quarterlyData: data
        });
    }

    private calculateBigFive(data: DiscountInput, annualEPS: PeriodicData[]): BigFive {
        const annualROIC = calculatorService.calculateROIC({
            cik: data.cik,
            timePeriod: 'A',
            quarterlyData: data
        });
        return {
            annualROIC: annualROIC,
            annualEPS: annualEPS,
            annualEquity: annualizeByLastQuarter(data.cik, data.quarterlyTotalEquity),
            annualRevenue: annualizeByAdd(data.cik, data.quarterlyRevenue),
            annualOperatingCashFlow: annualizeByAdd(data.cik, data.quarterlyOperatingCashFlow)
        }
    }

    private calculateTrailingPriceData(
        cik: string,
        annualBVPS: PeriodicData[],
        annualPE: PeriodicData[],
        annualEPS: PeriodicData[]
    ): TrailingPriceData[] {
        const annualGrowthRates = calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: annualBVPS
        });
        return [1, 5, 10].map(numPeriods => {
            const stickerPrice = calculatorService.calculateStickerPrice({
                cik: cik,
                equityGrowthRate: calculatorService.calculateAverageOverPeriod({
                    periodicData: annualGrowthRates,
                    numPeriods: numPeriods,
                    minimum: 10
                }),
                annualEPS: annualEPS,
                annualPE: annualPE
            });
            return {
                cik: cik,
                stickerPrice: stickerPrice,
                salePrice: stickerPrice / 2
            }
        });
    }

}

export default StickerPriceService;