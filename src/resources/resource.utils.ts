export function removeS3KeySuffix(key: string): string {
    return key.slice(0, -5);
}

export async function sleep(millis: number): Promise<void> {
    return new Promise(f => setTimeout(f, millis));
}
