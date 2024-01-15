import { EnterpriseValueInput } from "../calculator.typings";
import AbstractFunction from "./AbstractFunction";


class EnterpriseValueFunction extends AbstractFunction {

    calculate(data: {
        wacc: number,
        terminalValue: number,
        periodicData: EnterpriseValueInput
    }): number {
        const decimalWacc = data.wacc / 100;
        return data.periodicData.periodicFreeCashFlow.reduce((sum, freeCashFlow, index) => {
            const cashFlow = freeCashFlow.value;
            sum += cashFlow / Math.pow(1 + decimalWacc, index + 1);
            return sum;
        }, 0) + data.terminalValue / Math.pow(1 + decimalWacc, data.periodicData.periodicFreeCashFlow.length);
    }

}

export default EnterpriseValueFunction;