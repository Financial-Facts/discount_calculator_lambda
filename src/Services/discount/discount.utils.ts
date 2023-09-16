import CONSTANTS from "@/resources/resource.contants";

export function buildHeadersWithBasicAuth(): { Authorization: string, 'Content-Type': string } {
    return {
        Authorization: process.env.ffs_auth as string,
        'Content-Type': CONSTANTS.GLOBAL.JSON
    }
}
