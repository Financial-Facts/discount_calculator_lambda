import InsufficientDataException from "@/utils/exceptions/InsufficientDataException";
import { Statement } from "./statement.typings";

export function cleanStatements <T extends Statement>(
    cik: string,
    statements: T[]
): T[] {
    statements = reorderStatements(statements);
    statements = filterUnsupportedCurrency(statements);
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