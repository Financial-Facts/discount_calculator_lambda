import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";
import AbstractOutput from "./AbstractOutput";
import { TrailingPriceData } from "@/services/discount/discount.typings";
import { PeriodicData } from "../../sticker-price.typings";

class StickerPriceOutput implements AbstractOutput {

    public async submit(input: {
        cik: string, 
        equityGrowthRate: number,
        annualPE: PeriodicData[],
        currentQuarterlyEPS: number,
        analystGrowthEstimate?: number
    }): Promise<TrailingPriceData> {
        let forwardPE: number = input.annualPE.map(year => year.value).reduce((a, b) => a + b) / input.annualPE.length;

        // If analyst estimates are lower than the predicted equity growth rate, go with them
        if (!input.analystGrowthEstimate) {
            input.analystGrowthEstimate = input.equityGrowthRate;
        } else if (input.equityGrowthRate > input.analystGrowthEstimate) {
            input.equityGrowthRate = input.analystGrowthEstimate;
        }

        // check if two times equity growth rate is less than historical PE
        forwardPE = Math.min(input.equityGrowthRate * 2, forwardPE);

        // ToDo: check analysts estimates, if they're less, use those

        // Cap estimated EPS growth at 15%
        if (input.equityGrowthRate > 15) {
            input.equityGrowthRate = 15;
        }

        // Calculate the sticker price of the stock today relative to what predicted price will be in the future
        const num_years = 10
        const percent_return = 15

        // Plug in acquired values into Rule #1 equation
        const timeToDouble = Math.log10(2) / Math.log10(1 + (input.equityGrowthRate/100));
        const numOfDoubles = num_years/timeToDouble;
        const futurePrice = forwardPE * input.currentQuarterlyEPS * (Math.pow(2, numOfDoubles));

        const returnTimeToDouble = Math.log10(2)/Math.log10(1 + (percent_return/100));
        const numberOfEquityDoubles = num_years/returnTimeToDouble;
        const stickerPrice = futurePrice/(Math.pow(2, numberOfEquityDoubles));

        if (!stickerPrice || Number.isNaN(stickerPrice)) {
            throw new DisqualifyingDataException('Invalid sticker price data calculated');
        }
        
        return {
            cik: input.cik,
            stickerPrice: stickerPrice,
            salePrice: stickerPrice/2
        }
    }
}

export default StickerPriceOutput;