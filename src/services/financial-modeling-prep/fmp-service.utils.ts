export function simplifyCik(cik: string): string {
    return cik.substring(3);
}

export function buildURI(cik: string, identifier: string, apiKey: string, period: 'quarter' | 'annual' = 'quarter'): string {
    return `/api/v3/${identifier}/${simplifyCik(cik)}?period=${period}&apikey=${apiKey}`;
}