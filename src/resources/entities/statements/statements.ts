import BalanceSheet from "./balance-sheet";
import CashFlowStatement from "./cashflow-statement";
import IncomeStatement from "./income-statement";

export default interface Statements {

    incomeStatements: IncomeStatement[],

    balanceSheets: BalanceSheet[],

    cashFlowStatements: CashFlowStatement[]

}