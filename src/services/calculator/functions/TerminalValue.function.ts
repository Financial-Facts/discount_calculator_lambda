import Function from './Function';

export interface TerminalValueVariables {
    wacc: number,
    longTermGrowthRate: number,
    freeCashFlowT1: number
}

class TerminalValueFunction implements Function<TerminalValueVariables, number> {

    calculate(variables: TerminalValueVariables): number {
        const decimalWacc = variables.wacc / 100;
        const decimalLongTermGrowthRate = variables.longTermGrowthRate / 100;
        return variables.freeCashFlowT1 / (decimalWacc - decimalLongTermGrowthRate);
    }

}

export default TerminalValueFunction;