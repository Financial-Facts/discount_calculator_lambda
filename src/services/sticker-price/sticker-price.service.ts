import { StickerPrice, StickerPriceInput } from "./sticker-price.typings";
import { checkBigFiveExceedGrowthRateMinimum, checkDebtYearsExceedsMinimum } from "./sticker-price.utils";
import { calculatorService } from "../../bootstrap";
import { PeriodicData } from "@/src/types";
import { StickerPriceQuarterlyData } from "@/resources/discount-manager/discount-manager.typings";
import { annualizeByAdd, annualizeByLastQuarter } from "@/utils/annualize.utils";

class StickerPriceService {

    public getStickerPrice(data: StickerPriceInput): StickerPrice {
        console.log("In sticker price service calculating sticker price for CIK: " + data.cik);
        this.checkDataMeetsRequirements(data);
        return {
            cik: data.cik,
            price: this.calculateStickerPrice(data.cik, data.annualBVPS, data.annualPE, data.annualEPS, data.ffyEstimatedEpsGrowthRate),
            input: data
        }
    }

    public async buildStickerPriceInput(
        cik: string,
        symbol: string,
        data: StickerPriceQuarterlyData
    ): Promise<StickerPriceInput> {
        return {
            cik: cik,
            debtYears: calculatorService.calculateDebtYears({
                cik: cik,
                quarterlyData: data
            }),
            annualBVPS: calculatorService.calculateBVPS({
                cik: cik,
                timePeriod: 'A',
                quarterlyData: data
            }),
            annualPE: await calculatorService.calculatePE({
                cik: cik,
                timePeriod: 'A',
                symbol: symbol,
                quarterlyData: data
            }),
            annualROIC: calculatorService.calculateROIC({
                cik: cik,
                timePeriod: 'A',
                quarterlyData: data
            }),
            annualEPS: annualizeByAdd(cik, data.quarterlyEPS),
            annualEquity: annualizeByLastQuarter(cik, data.quarterlyTotalEquity),
            annualRevenue: annualizeByAdd(cik, data.quarterlyRevenue),
            annualOperatingCashFlow: annualizeByAdd(cik, data.quarterlyOperatingCashFlow),
            ffyEstimatedEpsGrowthRate: data.annualEstimatedEPS.length > 0 ? 
                calculatorService.calculateAverageOverPeriod({
                    periodicData: calculatorService.calculatePeriodicGrowthRates({
                        cik: cik,
                        periodicData: data.annualEstimatedEPS.reverse()
                    }),
                    numPeriods: 5
                }) : undefined
        }
    }
    

    private checkDataMeetsRequirements(data: StickerPriceInput): void {
        checkDebtYearsExceedsMinimum(data.cik, data.debtYears);
        checkBigFiveExceedGrowthRateMinimum(data.cik, {
            annualEPS: data.annualEPS,
            annualEquity: data.annualEquity,
            annualOperatingCashFlow: data.annualOperatingCashFlow,
            annualRevenue: data.annualRevenue,
            annualROIC: data.annualROIC
        });
    }

    private calculateStickerPrice(
        cik: string,
        annualBVPS: PeriodicData[],
        annualPE: PeriodicData[],
        annualEPS: PeriodicData[],
        ffyEstimatedEpsGrowthRate?: number
    ): number {
        const numPeriods = 10;
        return calculatorService.calculateStickerPrice({
            cik: cik,
            numPeriods: numPeriods,
            equityGrowthRate: calculatorService.calculateCAGR({
                periodicData: annualBVPS,
                period: numPeriods,
                minimumGrowth: 10,
                type: 'Annual BVPS'
            }),
            annualEPS: annualEPS,
            annualPE: annualPE,
            analystGrowthEstimate: ffyEstimatedEpsGrowthRate
        });
    }

}

export default StickerPriceService;