import { BigFive } from "@/services/calculator/calculator.typings";
import { calculatorService } from "../../bootstrap";
import { PeriodicData } from "@/src/types";
import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";

export function checkDebtYearsExceedsMinimum(cik: string, debtYears: number, maximum: number = 3): void {
    if (debtYears > maximum) {
        throw new DisqualifyingDataException(`${cik} has greater debt years than the maximum ${maximum}`)
    }
}

export function checkBigFiveExceedGrowthRateMinimum(cik: string, bigFive: BigFive): void {
    checkAnnualDataAvgExceedsValue(bigFive.annualROIC, 10, `Average annual ROIC does not meet minimum 10% for ${cik}`);
    checkAverageGrowthRateExceedsValue(bigFive.annualRevenue, 10, 'Annual Revenue', [5, 10]);
    checkAverageGrowthRateExceedsValue(bigFive.annualEPS, 10, 'Annual EPS', [1, 5, 10]);
    checkAverageGrowthRateExceedsValue(bigFive.annualEquity, 10, 'Annual Equity', [1, 5, 10]);
    checkAverageGrowthRateExceedsValue(bigFive.annualOperatingCashFlow, 10, 'Annual Operating Cash Flow', [5, 10]);
}

function checkAnnualDataAvgExceedsValue(
    annualData: PeriodicData[],
    value: number,
    errorMessage: string
): void {
    [1, 5, 10].forEach(period => {
        calculatorService.calculateAverageOverPeriod({ 
            periodicData: annualData,
            numPeriods: period,
            minimum: value,
            errorMessage: errorMessage
        });
    });
}

function checkAverageGrowthRateExceedsValue(
    data: PeriodicData[],
    value: number,
    type: string,
    periods: number[]
): void {
    periods.forEach(period => {
        calculatorService.calculateCAGR({
            periodicData: data,
            period: period,
            minimumGrowth: value,
            type: type
        })
    });
}
