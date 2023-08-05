import BvpsFunction from "./functions/BvpsFunction";
import QuarterlyData from "@/resources/entities/models/QuarterlyData";
import Discount from "@/resources/entities/discount/IDiscount";
import PeFunction from "./functions/PeFunction";
import RoicFunction from "./functions/RoicFunction";
import StickerPriceData from "@/resources/entities/facts/IStickerPriceData";
import StickerPriceOutput from "./outputs/StickerPriceOutput";
import TrailingPriceData from "@/resources/entities/discount/models/TrailingPriceData";
import HistoricalPriceService from "Services/HistoricalPriceService/HistoricalPriceService";
import DisqualifyingDataException from "../../../../utils/exceptions/DisqualifyingDataException";
import { annualizeByAdd } from "../../../../Services/StickerPriceService/utils/StickerPriceUtils";
import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";

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
        console.log("In calculator calculating sticker price for CIK: " + data.cik);
        return Promise.all([
            this.calculateQuarterlyBVPS(data),
            this.calculateQuarterlyPE(data),
            this.calculateQuarterlyROIC(data)])
        .then(async (quarterlyData: QuarterlyData[][]) => {
            console.log("Finished calculating quarterly data for " + data.cik);

            const [ quarterlyBVPS, quarterlyPE, quarterlyROIC ] = quarterlyData;
            const growthRates = this.calculateGrowthRates(data.cik, quarterlyBVPS);
            this.checkRatesMeetRequirements(data.cik, growthRates);

            const annualPE = this.peFunction.annualize(data.cik, quarterlyPE);
            const annualBVPS = this.bvpsFunction.annualize(data.cik, quarterlyBVPS);
            const annualROIC = this.roicFunction.annualize(data.cik, quarterlyROIC);
            const annualEPS = annualizeByAdd(data.cik, data.quarterlyEPS);
            this.checkAnnualAvgExceedsZero(data.cik, [annualPE, annualBVPS, annualROIC, annualEPS]);
            this.checkRoicExceedsMinimum(data.cik, annualROIC);

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
                .then(async trailingPriceData => {
                    const [ttmPriceData, tfyPriceData, ttyPriceData ] = trailingPriceData;
                    return {
                        cik: data.cik,
                        symbol: data.symbol,
                        name: data.name,
                        active: false,
                        ratioPrice: data.benchmarkRatioPrice,
                        lastUpdated: new Date(),
                        ttmPriceData: ttmPriceData,
                        tfyPriceData: tfyPriceData,
                        ttyPriceData: ttyPriceData,
                        quarterlyBVPS: quarterlyBVPS,
                        quarterlyPE: quarterlyPE,
                        quarterlyEPS: data.quarterlyEPS,
                        quarterlyROIC: quarterlyROIC,
                        annualROIC: this.roicFunction.annualize(data.cik, quarterlyROIC)
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

    private checkRatesMeetRequirements(cik: string, growthRates: Record<number, number>): void {
        Object.values(growthRates).forEach(value => {
            if (value < 10) {
                throw new DisqualifyingDataException(`Growth rates do not meet a minimum of 10% for ${cik}`);
            }
        })
    }

    private checkAnnualAvgExceedsZero(cik: string, annualData: QuarterlyData[][]): void {
        this.checkAnnualDataAvgExceedsValue(annualData, 0, `Annual data is on average negative for ${cik}`);
    }

    private checkRoicExceedsMinimum(cik: string, annualRoic: QuarterlyData[]): void {
        this.checkAnnualDataAvgExceedsValue([annualRoic], 10, `Annual ROIC does not meet minimum 10% for ${cik}`);
    }

    private checkAnnualDataAvgExceedsValue(
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
}

export default Calculator;