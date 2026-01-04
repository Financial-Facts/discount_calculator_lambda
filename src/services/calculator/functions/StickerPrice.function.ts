import Function from "./Function";
import { calculatorService } from "../../../bootstrap";
import { PeriodicData } from "@/src/types";
import { averageOverPeriodFunction } from "../calculator.service";


export interface StickerPriceVariables {
    cik: string, 
    numPeriods: number,
    equityGrowthRate: number,
    annualPE: PeriodicData[],
    annualEPS: PeriodicData[],
    analystGrowthEstimate?: number
}

class StickerPriceFunction implements Function<StickerPriceVariables, number> {

    calculate(variables: StickerPriceVariables): number {
        const currentAnnualEps = variables.annualEPS[variables.annualEPS.length - 1].value;
        let forwardPE: number = calculatorService.calculate(
            {
                periodicData: variables.annualPE,
                numPeriods: variables.numPeriods
            },
            averageOverPeriodFunction
        );

        // If analyst estimates are lower than the predicted equity growth rate, go with them
        if (!variables.analystGrowthEstimate) {
            variables.analystGrowthEstimate = variables.equityGrowthRate;
        } else if (variables.equityGrowthRate > variables.analystGrowthEstimate) {
            variables.equityGrowthRate = variables.analystGrowthEstimate;
        }

        // check if two times equity growth rate is less than historical PE
        forwardPE = Math.min(variables.equityGrowthRate * 2, forwardPE);

        // Calculate the sticker price of the stock today relative to what predicted price will be in the future
        const num_years = 10
        const percent_return = 15

        // Plug in acquired values into Rule #1 equation
        const timeToDouble = Math.log10(2) / Math.log10(1 + (variables.equityGrowthRate/100));
        const numOfDoubles = num_years/timeToDouble;
        const futurePrice = forwardPE * currentAnnualEps * (Math.pow(2, numOfDoubles));

        const returnTimeToDouble = Math.log10(2)/Math.log10(1 + (percent_return/100));
        const numberOfEquityDoubles = num_years/returnTimeToDouble;
        const stickerPrice = futurePrice/(Math.pow(2, numberOfEquityDoubles));
        
        return stickerPrice;
    }
    
}

export default StickerPriceFunction;