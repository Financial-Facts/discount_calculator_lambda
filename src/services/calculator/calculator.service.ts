import { BvpsInput, DebtYearsInput, IcInput, NopatInput, PeInput, RoicInput } from "@/resources/discount-manager/discount-manager.typings";
import { EnterpriseValueInput, TimePeriod } from "./calculator.typings";
import AverageOverPeriodFunction from "./functions/AverageOverPeriod.function";
import BvpsFunction from "./functions/BVPS.function";
import BenchmarkRatioPriceFunction from "./functions/BenchmarkRatioPrice.function";
import IcFunction from "./functions/IC.function";
import NopatFunction from "./functions/NOPAT.function";
import PeFunction from "./functions/PE.function";
import PeriodicGrowthRatesFunction from "./functions/PeriodicGrowthRates.function";
import RoicFunction from "./functions/ROIC.function";
import StickerPriceFunction from "./functions/StickerPrice.function";
import { PeriodicData } from "@/src/types";
import DebtYearsFunction from "./functions/DebtYears.function";
import DcfFunction from "./functions/DCF.function";
import TerminalValueFunction from "./functions/TerminalValue.function";
import EnterpriseValueFunction from "./functions/EnterpriseValue.function";
import WaccFunction from "./functions/WACC.function";
import CagrFunction from "./functions/CAGR.function";
import Function from "./functions/Function";


export const bvpsFunction = new BvpsFunction();
export const peFunction = new PeFunction();
export const roicFunction = new RoicFunction();
export const nopatFunction = new NopatFunction();
export const icFunction = new IcFunction();
export const debtYearsFunction = new DebtYearsFunction();
export const benchmarkRatioPriceFunction = new BenchmarkRatioPriceFunction();
export const periodicGrowthRatesFunction = new PeriodicGrowthRatesFunction();
export const averageOverPeriodFunction = new AverageOverPeriodFunction();
export const stickerPriceFunction = new StickerPriceFunction();
export const discountedCashFlowFunction = new DcfFunction();
export const terminalValueFunction = new TerminalValueFunction();
export const enterpriseValueFunction = new EnterpriseValueFunction();
export const waccFunction = new WaccFunction();
export const cagrFunction = new CagrFunction();

class CalculatorService {

    public calculate<I, O>(
        variables: I,
        calculatorFunction: Function<I, O>
    ): O {
        return calculatorFunction.calculate(variables);
    }
    
}

export default CalculatorService;