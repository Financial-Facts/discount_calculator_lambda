import CONSTANTS from "../resources/ResourceConstants";

export function buildHeadersWithBasicAuth(): { Authorization: string, 'Content-Type': string } {
    return {
        'Content-Type': CONSTANTS.GLOBAL.JSON
    }
}
