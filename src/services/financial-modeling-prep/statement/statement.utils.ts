import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { Statement } from "./statement.typings";

export function cleanStatements <T extends Statement>(
    cik: string,
    symbol: string,
    statements: T[]
): T[] {
    statements = reorderStatements(statements);
    statements = filterUnsupportedCurrency(statements);
    statements = filterOutPeriodSymbols(statements);
    statements = filterOutRepeatedQuarters(statements);
    statements = ensureConstantSymbol(statements, symbol);
    statements = filterToLastElevenYears(cik, statements);
    checkConsecutive(cik, statements);
    return statements;
}

function reorderStatements <T extends Statement>(
    statements: T[]
): T[] {
    return statements.reverse();
}

function filterUnsupportedCurrency <T extends Statement>(
    statements: T[]
): T[] {
    return statements.filter(statement => statement.reportedCurrency === 'USD');
}

function filterOutPeriodSymbols <T extends Statement>(
    statements: T[]
): T[] {
    return statements.filter(statement => !statement.symbol.includes('.'));
}

function filterOutRepeatedQuarters <T extends Statement>(
    statements: T[]
): T[] {
    return statements.filter((statement, index) => {
        if (index + 1 < statements.length) {
            const nextStatement = statements[index + 1];
            switch (statement.period) {
                case ('Q1'): {
                    return nextStatement.period === 'Q2';
                }
                case ('Q2'): {
                    return nextStatement.period === 'Q3';
                }
                case ('Q3'): {
                    return nextStatement.period === 'Q4';
                }
                case ('Q4'): {
                    return nextStatement.period === 'Q1';
                }
                default: {
                    return false;
                }
            }
        }

        return true;
    });
}

function ensureConstantSymbol <T extends Statement>(
    statements: T[],
    symbol: string
): T[] {
    return statements.map(statement => ({
        ...statement,
        symbol: symbol
    }));
}

function filterToLastElevenYears <T extends Statement>(
    cik: string,
    statements: T[]
): T[] {
    if (statements.length < 44) {
        throw new InsufficientDataException(`Not enough statements available for ${cik}`);
    }
    return statements.slice(-44);
}

function checkConsecutive <T extends Statement>(
    cik: string,
    statements: T[]
): void {
    let lastDate = new Date(statements[0].date);
    statements.slice(1).forEach(statement => {
        const statementDateTime = new Date(statement.date);
        const diffTime = Math.abs(statementDateTime.valueOf() - lastDate.valueOf());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays > 131) {
            throw new InsufficientDataException(`Statements are not consecutive after ${lastDate} for ${cik}`)
        }
        lastDate = statementDateTime;
    });
}