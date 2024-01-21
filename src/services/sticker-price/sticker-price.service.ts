import { StickerPrice, StickerPriceInput } from "./sticker-price.typings";
import { checkBigFiveExceedGrowthRateMinimum, checkDebtYearsExceedsMinimum } from "./sticker-price.utils";
import { calculatorService } from "../../bootstrap";
import { PeriodicData } from "@/src/types";

class StickerPriceService {

    public calculateStickerPriceObject(data: StickerPriceInput): StickerPrice {
        console.log("In calculator calculating sticker price for CIK: " + data.cik);
       this.checkDataMeetsRequirements(data);
        const price =
            this.calculateStickerPrice(data.cik, data.annualBVPS, data.annualPE, data.annualEPS);
        return {
            cik: data.cik,
            price: price,
            input: data
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
        annualEPS: PeriodicData[]
    ): number {
        const annualGrowthRates = calculatorService.calculatePeriodicGrowthRates({
            cik: cik,
            periodicData: annualBVPS
        });
        const numPeriods = 10;
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
        return stickerPrice;
    }

}

export default StickerPriceService;