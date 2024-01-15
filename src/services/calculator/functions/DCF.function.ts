import AbstractFunction from "./AbstractFunction";


class DcfFunction extends AbstractFunction {

    calculate(data: {
        enterpriseValue: number,
        totalCash: number,
        totalDebt: number,
        dilutedSharesOutstanding: number
    }): number {
        const intrinsicValue = data.enterpriseValue + data.totalCash - data.totalDebt;
        return intrinsicValue / data.dilutedSharesOutstanding;
    }
    
}

export default DcfFunction;