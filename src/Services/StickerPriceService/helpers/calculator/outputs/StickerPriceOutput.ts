import TrailingPriceData from "@/resources/entities/discount/models/TrailingPriceData";
import { PeriodicData } from "@/resources/entities/models/PeriodicData";
import DisqualifyingDataException from "@/utils/exceptions/DisqualifyingDataException";

class StickerPriceOutput {

    public async submit(
        cik: string, 
        equityGrowthRate: number,
        annualPE: PeriodicData[],
        currentQuarterlyEPS: number,
        analystGrowthEstimate?: number
    ): Promise<TrailingPriceData> {
        const forwardPE: number = annualPE.map(year => year.value).reduce((a, b) => a + b) / annualPE.length;

        // If analyst estimates are lower than the predicted equity growth rate, go with them
        if (!analystGrowthEstimate) {
            analystGrowthEstimate = equityGrowthRate;
        } else if (equityGrowthRate > analystGrowthEstimate) {
            equityGrowthRate = analystGrowthEstimate;
        }

        // Calculate the sticker price of the stock today relative to what predicted price will be in the future
        const num_years = 10
        const percent_return = 15

        // Plug in acquired values into Rule #1 equation
        const timeToDouble = Math.log(2)/Math.log(1 + (equityGrowthRate/100));
        const numOfDoubles = num_years/timeToDouble;
        const futurePrice = forwardPE * currentQuarterlyEPS * (Math.pow(2, numOfDoubles));

        const returnTimeToDouble = Math.log(2)/Math.log(1 + (percent_return/100));
        const numberOfEquityDoubles = num_years/returnTimeToDouble;
        const stickerPrice = futurePrice/(Math.pow(2, numberOfEquityDoubles));

        if (!stickerPrice || Number.isNaN(stickerPrice)) {
            throw new DisqualifyingDataException('Invalid sticker price data calculated');
        }
        
        return {
            cik: cik,
            stickerPrice: stickerPrice,
            salePrice: stickerPrice/2
        }
    }
}

export default StickerPriceOutput;