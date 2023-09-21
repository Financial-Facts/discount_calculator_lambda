import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import { PeriodicData } from "../../sticker-price/sticker-price.typings";
import AbstractFunction from "./AbstractFunction";
import { calculatorService } from "../../../bootstrap";


class StickerPriceFunction extends AbstractFunction {

    calculate(data: {
        cik: string, 
        equityGrowthRate: number,
        annualPE: PeriodicData[],
        annualEPS: PeriodicData[],
        analystGrowthEstimate?: number
    }): number {
        const currentAnnualEps = data.annualEPS[data.annualEPS.length - 1].value;
        let forwardPE: number = calculatorService.calculateAverageOverPeriod({
            periodicData: data.annualPE,
            numPeriods: 10
        });

        // If analyst estimates are lower than the predicted equity growth rate, go with them
        if (!data.analystGrowthEstimate) {
            data.analystGrowthEstimate = data.equityGrowthRate;
        } else if (data.equityGrowthRate > data.analystGrowthEstimate) {
            data.equityGrowthRate = data.analystGrowthEstimate;
        }

        // check if two times equity growth rate is less than historical PE
        forwardPE = Math.min(data.equityGrowthRate * 2, forwardPE);

        // ToDo: check analysts estimates, if they're less, use those

        // Cap estimated EPS growth at 15%
        if (data.equityGrowthRate > 15) {
            data.equityGrowthRate = 15;
        }

        // Calculate the sticker price of the stock today relative to what predicted price will be in the future
        const num_years = 10
        const percent_return = 15

        // Plug in acquired values into Rule #1 equation
        const timeToDouble = Math.log10(2) / Math.log10(1 + (data.equityGrowthRate/100));
        const numOfDoubles = num_years/timeToDouble;
        const futurePrice = forwardPE * currentAnnualEps * (Math.pow(2, numOfDoubles));

        const returnTimeToDouble = Math.log10(2)/Math.log10(1 + (percent_return/100));
        const numberOfEquityDoubles = num_years/returnTimeToDouble;
        const stickerPrice = futurePrice/(Math.pow(2, numberOfEquityDoubles));

        if (!stickerPrice || Number.isNaN(stickerPrice)) {
            throw new DisqualifyingDataException('Invalid sticker price data calculated');
        }
        
        return stickerPrice;
    }
    
}

export default StickerPriceFunction;