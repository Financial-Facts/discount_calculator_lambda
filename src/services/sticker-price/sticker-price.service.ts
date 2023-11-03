import { StickerPrice, StickerPriceInput, TrailingPriceData } from "./sticker-price.typings";
import { checkBigFiveExceedGrowthRateMinimum } from "./sticker-price.utils";
import { calculatorService } from "../../bootstrap";
import { PeriodicData } from "@/src/types";

class StickerPriceService {

    public calculateStickerPriceObject(data: StickerPriceInput): StickerPrice {
        console.log("In calculator calculating sticker price for CIK: " + data.cik);
        checkBigFiveExceedGrowthRateMinimum(data.cik, {
            annualEPS: data.annualEPS,
            annualEquity: data.annualEquity,
            annualOperatingCashFlow: data.annualOperatingCashFlow,
            annualRevenue: data.annualRevenue,
            annualROIC: data.annualROIC
        });
        const [ ttmPriceData, tfyPriceData, ttyPriceData ] =
            this.calculateTrailingPriceData(data.cik, data.annualBVPS, data.annualPE, data.annualEPS);
        return {
            cik: data.cik,
            ttmPriceData: ttmPriceData,
            tfyPriceData: tfyPriceData,
            ttyPriceData: ttyPriceData,
            input: data
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
                numPeriods: numPeriods,
                equityGrowthRate: calculatorService.calculateAverageOverPeriod({
                    periodicData: annualGrowthRates,
                    numPeriods: numPeriods,
                    minimum: 10,
                    errorMessage: `Average annual growth rate over the passed ${numPeriods} year(s) does not exceed 10%`
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