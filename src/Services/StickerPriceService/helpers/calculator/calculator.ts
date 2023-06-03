import PriceData from "../../../HistoricalPriceService/models/PriceData";
import AbstractFunction from "./functions/AbstractFunction";
import BvpsFunction from "./functions/BvpsFunction";
import QuarterlyData from "@/resources/discount/models/QuarterlyData";
import Discount from "@/resources/discount/IDiscount";
import Identity from "@/resources/identity/models/Identity";

class Calculator {

    private identity: Identity;
    private h_data: PriceData[];
    private facts: any;
    private calcFunction: AbstractFunction;

    constructor(identity: Identity, h_data: PriceData[], facts: any) {
        this.identity = identity;
        this.h_data = h_data;
        this.facts = facts;
        this.calcFunction = new BvpsFunction(this.identity.cik, this.facts);
    }

    public async calculateStickerPriceData(): Promise<Discount> {
        return this.calculateQuarterlyBVPS().then((quarterly_BVPS) => {
            const { tyy_BVPS_growth, tfy_BVPS_growth, tty_BVPS_growth } = this.calculateGrowthRates(quarterly_BVPS);
            return {
                cik: this.identity.cik,
                symbol: this.identity.symbol,
                name: this.identity.name,
                ratioPrice: 0,
                lastUpdated: new Date(),
                ttmPriceData: [],
                tfyPriceData: [],
                ttyPriceData: [],
                quarterlyBVPS: quarterly_BVPS,
                quarterlyPE: [],
                quarterlyEPS: [],
                quarterlyROIC: [],
            }
        })
    }

    private async calculateQuarterlyBVPS(): Promise<QuarterlyData[]> {
        return this.calcFunction.setVariables().then(() => {
            return this.calcFunction.calculate();
        });
    }

    private calculateGrowthRates(quarterlyBVPS: QuarterlyData[]): { tyy_BVPS_growth: number, tfy_BVPS_growth: number, tty_BVPS_growth: number } {
        const { lastQuarters, annualBVPS } = this.calcFunction.annualize(quarterlyBVPS);
        const tyy_BVPS_growth = (Math.pow(lastQuarters[lastQuarters.length - 1] / lastQuarters[0], (1/1)) - 1) * 100;
        const tfy_BVPS_growth = (Math.pow(annualBVPS[annualBVPS.length - 1].value / annualBVPS[annualBVPS.length - 5].value, (1/5)) - 1) * 100;
        const tty_BVPS_growth = (Math.pow(annualBVPS[annualBVPS.length - 1].value / annualBVPS[annualBVPS.length - 10].value, (1/10)) - 1) * 100;
        return { tyy_BVPS_growth, tfy_BVPS_growth, tty_BVPS_growth }
    }

}

export default Calculator;