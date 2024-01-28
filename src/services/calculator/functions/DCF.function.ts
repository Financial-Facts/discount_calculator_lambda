import AbstractFunction from "./AbstractFunction";


class DcfFunction extends AbstractFunction {

    calculate(data: {
        enterpriseValue: number,
        netDebt: number,
        dilutedSharesOutstanding: number
    }): number {
        const intrinsicValue = data.enterpriseValue - data.netDebt;
        return intrinsicValue / data.dilutedSharesOutstanding;
    }
    
}

export default DcfFunction;