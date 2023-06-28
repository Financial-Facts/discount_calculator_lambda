import CONSTANTS from "../resources/ResourceConstants";

export function buildHeadersWithBasicAuth(): { Authorization: string, 'Content-Type': string } {
    return {
        Authorization: '',
        'Content-Type': CONSTANTS.GLOBAL.JSON
    }
}