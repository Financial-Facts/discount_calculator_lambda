import AbstractFunction from "./AbstractFunction";


class TerminalValueFunction extends AbstractFunction {

    calculate(data: {
        wacc: number,
        longTermGrowthRate: number,
        freeCashFlowT1: number
    }): number {
        const decimalWacc = data.wacc / 100;
        const decimalLongTermGrowthRate = data.longTermGrowthRate / 100;
        return data.freeCashFlowT1 / (decimalWacc - decimalLongTermGrowthRate);
    }

}

export default TerminalValueFunction;