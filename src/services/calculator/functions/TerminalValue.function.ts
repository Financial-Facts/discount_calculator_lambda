import AbstractFunction from "./AbstractFunction";


class TerminalValueFunction extends AbstractFunction {

    calculate(data: {
        wacc: number,
        riskFreeRate: number,
        ttmFreeCashFlow: number
    }): number {
        const decimalWacc = data.wacc / 100;
        const decimalRFR = data.riskFreeRate / 100;
        return (data.ttmFreeCashFlow * (1 + decimalRFR)) / (decimalWacc - decimalRFR);
    }

}

export default TerminalValueFunction;