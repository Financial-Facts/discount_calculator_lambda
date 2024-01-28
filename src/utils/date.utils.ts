// Returns the number of days between two dates
export function days_between(d1: Date, d2: Date): number {
    const diff = Math.abs(d1.getTime() - d2.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24));
}

export function addYears(date: Date, numYears: number): Date {
    const copy = new Date(date);
    copy.setFullYear(copy.getFullYear() + numYears);
    return copy;
}