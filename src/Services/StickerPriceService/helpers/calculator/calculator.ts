import BvpsFunction from "./functions/BvpsFunction";
import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import Discount from "@/resources/entities/discount/IDiscount";
import PeFunction from "./functions/PeFunction";
import InsufficientDataException from "../../../../exceptions/InsufficientDataException";
import RoicFunction from "./functions/RoicFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import StickerPriceOutput from "./outputs/StickerPriceOutput";
import TrailingPriceData from "@/resources/entities/discount/models/TrailingPriceData";
import HistoricalPriceService from "Services/HistoricalPriceService/HistoricalPriceService";

class Calculator {

    private bvpsFunction: BvpsFunction;
    private peFunction: PeFunction;
    private roicFunction: RoicFunction;
    private stickerPriceOutput: StickerPriceOutput;
    
    constructor(historicalPriceService: HistoricalPriceService) {
        this.bvpsFunction = new BvpsFunction();
        this.peFunction = new PeFunction(historicalPriceService);
        this.roicFunction = new RoicFunction();
        this.stickerPriceOutput = new StickerPriceOutput();
    }

    public async calculateStickerPriceData(data: StickerPriceData): Promise<Discount> {
        return Promise.all([
            this.calculateQuarterlyBVPS(data),
            this.calculateQuarterlyPE(data),
            this.calculateQuarterlyROIC(data)])
        .then((quarterlyData: QuarterlyData[][]) => {
            const [ quarterlyBVPS, quarterlyPE, quarterlyROIC ] = quarterlyData;
            const growthRates = this.calculateGrowthRates(data.cik, quarterlyBVPS);
            const annualPE = this.peFunction.annualize(data.cik, quarterlyPE);
            const analystGrowthEstimate: number = 0; //ToDo: Add growth estimate service
            const trailingPricePromises: Promise<TrailingPriceData>[] = [];
            Object.keys(growthRates)
                .forEach((key: string) => {
                    const period: number = +key;
                    trailingPricePromises.push(this.stickerPriceOutput.submit(
                        data.cik,
                        growthRates[period],
                        annualPE,
                        data.quarterlyEPS[data.quarterlyEPS.length - 1].value,
                        analystGrowthEstimate));
                    });
            return Promise.all(trailingPricePromises)
                .then(trailingPriceData => {
                    const [ttmPriceData, tfyPriceData, ttyPriceData ] = trailingPriceData;
                    return {
                        cik: data.cik,
                        symbol: data.symbol,
                        name: data.name,
                        ratioPrice: data.benchmarkRatioPrice,
                        lastUpdated: new Date(),
                        ttmPriceData: ttmPriceData,
                        tfyPriceData: tfyPriceData,
                        ttyPriceData: ttyPriceData,
                        quarterlyBVPS: quarterlyBVPS,
                        quarterlyPE: quarterlyPE,
                        quarterlyEPS: data.quarterlyEPS,
                        quarterlyROIC: quarterlyROIC
                    }
                });
        });
    }

    private async calculateQuarterlyBVPS(stickerPriceData: StickerPriceData): Promise<QuarterlyData[]> {
        return this.bvpsFunction.calculate(stickerPriceData);
    }

    private async calculateQuarterlyPE(stickerPriceData: StickerPriceData): Promise<QuarterlyData[]> {
        return this.peFunction.calculate(stickerPriceData);
    }

    private async calculateQuarterlyROIC(stickerPriceData: StickerPriceData): Promise<QuarterlyData[]> {
        return this.roicFunction.calculate(stickerPriceData);
    }

    private calculateGrowthRates(cik: string, quarterlyBVPS: QuarterlyData[]): Record<number, number> {
        try {
            const { lastQuarters, annualBVPS } = this.bvpsFunction.getLastQuarterAndAnnualizedData(cik, quarterlyBVPS);
            const tyy_BVPS_growth = (Math.pow(lastQuarters[lastQuarters.length - 1] / lastQuarters[0], (1/1)) - 1) * 100;
            const tfy_BVPS_growth = (Math.pow(annualBVPS[annualBVPS.length - 1].value / annualBVPS[annualBVPS.length - 5].value, (1/5)) - 1) * 100;
            const tty_BVPS_growth = (Math.pow(annualBVPS[annualBVPS.length - 1].value / annualBVPS[annualBVPS.length - 10].value, (1/10)) - 1) * 100;
            return { 1: tyy_BVPS_growth, 5: tfy_BVPS_growth, 10: tty_BVPS_growth };
        } catch (error: any) {
            throw new InsufficientDataException(`Insufficient data collected to calcuate growth rates for ${cik}`);
        }
    }

}

export default Calculator;