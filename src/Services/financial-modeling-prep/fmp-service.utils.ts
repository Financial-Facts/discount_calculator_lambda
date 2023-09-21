export function simplifyCik(cik: string): string {
    return cik.substring(3);
}

export function buildURI(cik: string, identifier: string, apiKey: string): string {
    return `/api/v3/${identifier}/${simplifyCik(cik)}?period=quarter&apikey=${apiKey}&limit=132`;
}