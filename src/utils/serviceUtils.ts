import CONSTANTS from "../resources/ResourceConstants";

export function buildHeadersWithBasicAuth(): { Authorization: string, 'Content-Type': string } {
    return {
        Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
        'Content-Type': CONSTANTS.GLOBAL.JSON
    }
}