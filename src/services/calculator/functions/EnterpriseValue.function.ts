import { EnterpriseValueInput } from "../calculator.typings";
import Function from "./Function";


export interface EnterpriseValueVariables {
    wacc: number,
    terminalValue: number,
    periodicData: EnterpriseValueInput
}

class EnterpriseValueFunction implements Function<EnterpriseValueVariables, number> {

    calculate(variables: EnterpriseValueVariables): number {
        const decimalWacc = variables.wacc / 100;
        return variables.periodicData.periodicFreeCashFlow.reduce((sum, freeCashFlow, index) => {
            const cashFlow = freeCashFlow.value;
            sum += cashFlow / Math.pow(1 + decimalWacc, index + 1);
            return sum;
        }, 0) + variables.terminalValue / Math.pow(1 + decimalWacc, variables.periodicData.periodicFreeCashFlow.length);
    }

}

export default EnterpriseValueFunction;