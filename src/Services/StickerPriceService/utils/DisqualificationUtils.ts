import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import StickerPriceInput from "../helpers/calculator/models/StickerPriceInput";

export function checkValuesMeetRequirements(input: StickerPriceInput): void {
    checkRatesMeetRequirements(input.data.cik, input.growthRates);
    checkAnnualAvgExceedsZero(input.data.cik, [
        input.annualPE, input.annualBVPS,
        input.annualROIC, input.annualEPS
    ]);
    checkRoicExceedsMinimum(input.data.cik, input.annualROIC);
}

function checkRatesMeetRequirements(cik: string, growthRates: Record<number, number>): void {
    Object.values(growthRates).forEach(value => {
        if (value < 10) {
            throw new DisqualifyingDataException(`Growth rates do not meet a minimum of 10% for ${cik}`);
        }
    })
}

function checkAnnualAvgExceedsZero(cik: string, annualData: QuarterlyData[][]): void {
    checkAnnualDataAvgExceedsValue(annualData, 0, `Annual data is on average negative for ${cik}`);
}

function checkRoicExceedsMinimum(cik: string, annualRoic: QuarterlyData[]): void {
    checkAnnualDataAvgExceedsValue([annualRoic], 10, `Annual ROIC does not meet minimum 10% for ${cik}`);
}

function checkAnnualDataAvgExceedsValue(
    annualData: QuarterlyData[][],
    value: number,
    errorMessage: string
): void {
    annualData.forEach(dataset => {
        const averageOverPeriod = {
            1: dataset.slice(-1)[0].value,
            5: dataset.slice(-5).map(year => year.value).reduce((a, b) => a + b)/5,
            10: dataset.slice(-10).map(year => year.value).reduce((a, b) => a + b)/10
        }
        if (averageOverPeriod[1] < value ||
            averageOverPeriod[5] < value || 
            averageOverPeriod[10] < value) {
            throw new DisqualifyingDataException(errorMessage);
        }
    })
}