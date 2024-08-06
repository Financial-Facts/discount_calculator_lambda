import { BigFive } from "@/services/calculator/calculator.typings";
import { calculatorService } from "../../bootstrap";
import { PeriodicData } from "@/src/types";
import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import { Qualifier } from "@/services/discount/ffs-discount/discount.typings";
import { StickerPriceInput } from "@/services/sticker-price/sticker-price.typings";


export const buildQualifyingData = (
    stickerPriceInput: StickerPriceInput
): Qualifier[] => {
    checkDebtYearsExceedsMinimum(stickerPriceInput.cik, stickerPriceInput.debtYears);
    return checkBigFiveExceedGrowthRateMinimum(stickerPriceInput.cik, stickerPriceInput);
}


export function checkDebtYearsExceedsMinimum(cik: string, debtYears: number, maximum: number = 3): void {
    if (debtYears > maximum) {
        throw new DisqualifyingDataException(`${cik} has greater debt years than the maximum ${maximum}`)
    }
}


export function checkBigFiveExceedGrowthRateMinimum(cik: string, bigFive: BigFive): Qualifier[] {
    return [
        ...checkAnnualDataAvgExceedsValue(cik, 'annualROIC', bigFive.annualROIC, 10, `Average annual ROIC does not meet minimum 10% for ${cik}`),
        ...checkAverageGrowthRateExceedsValue(cik, 'annualRevenue', bigFive.annualRevenue, 10, 'Annual Revenue', [5, 10]),
        ...checkAverageGrowthRateExceedsValue(cik, 'annualEPS', bigFive.annualEPS, 10, 'Annual EPS', [1, 5, 10]),
        ...checkAverageGrowthRateExceedsValue(cik, 'annualEquity', bigFive.annualEquity, 10, 'Annual Equity', [1, 5, 10]),
        ...checkAverageGrowthRateExceedsValue(cik, 'annualOperatingCashFlow', bigFive.annualOperatingCashFlow, 10, 'Annual Operating Cash Flow', [5, 10])
    ]
}


function checkAnnualDataAvgExceedsValue(
    cik: string,
    type: keyof BigFive,
    annualData: PeriodicData[],
    minimum: number,
    errorMessage: string
): Qualifier[] {
    return [1, 5, 10].map(period => ({
        cik: cik,
        type: type,
        periods: period,
        value: calculatorService.calculateAverageOverPeriod({ 
            periodicData: annualData,
            numPeriods: period,
            minimum: minimum,
            errorMessage: errorMessage
        })
    }));
}


function checkAverageGrowthRateExceedsValue(
    cik: string,
    type: keyof BigFive,
    data: PeriodicData[],
    minimum: number,
    name: string,
    periods: number[]
): Qualifier[] {
    return periods.map(period => ({
        cik: cik,
        type: type,
        periods: period,
        value: calculatorService.calculateCAGR({
            periodicData: data,
            period: period,
            minimumGrowth: minimum,
            type: name
        })
    }));
}
