export function days_between(d1: Date, d2: Date): number {
    const diff = Math.abs(d1.getTime() - d2.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24));
}

export function median_date(d1: Date, d2: Date): Date {
     return new Date((d1.getTime() + d2.getTime()) / 2);
}

export function quarterize(data: number[]): number[] {
    const chunkSize: number = data.length/4; 
    const result: number[] = [];
    let i = data.length;
    while (i >= 1) {
        const chunk = data.slice(i - chunkSize, i);
        result.splice(0, 0,
            chunk.reduce((a: number, b: number) => {
                return a + b;
            })/chunk.length);
        i -= chunkSize;
    }
    return result;
}