import BalanceSheet from "./balance-sheet";
import IncomeStatement from "./income-statement";

export default interface Statements {

    incomeStatements: IncomeStatement[],

    balanceSheets: BalanceSheet[]

}