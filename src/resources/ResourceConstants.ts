const CONSTANTS = {
    GLOBAL: {
        POST: 'POST',
        PUT: 'PUT',
        JSON: 'Application/json',
        CIK_REGEX: 'CIK[0-9]{10}'
    },
    DISCOUNT: {
        V1_ENDPOINT: '/v1/discount',
        CREATION_ERROR: 'Failure during discount creation request: ',
        UPDATE_ERROR: 'Failure during discount update request: ',
        FETCH_ERROR: 'Failure during discount get request: '    },
    FACTS: {
        V1_ENDPOINT: '/v1/facts',
        FETCH_ERROR: 'Failure during facts get request: ',
        INPUT_ERROR: 'Invalid input parameters'
    }
}

export default CONSTANTS;
