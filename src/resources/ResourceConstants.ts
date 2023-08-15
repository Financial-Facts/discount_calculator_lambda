const CONSTANTS = {
    GLOBAL: {
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        JSON: 'Application/json',
        CIK_REGEX: 'CIK[0-9]{10}',
        AUTHORIZATION: 'Authorization',
        EMPTY: ''
    },
    DISCOUNT: {
        V1_ENDPOINT: '/v1/discount',
        CREATION_ERROR: 'Failure during discount creation request: ',
        UPDATE_ERROR: 'Failure during discount update request: ',
        FETCH_ERROR: 'Failure during discount get request: ',
        FETCH_ALL_CIK_ERROR: 'Failure during discount get all simple discount request: '    },
    FACTS: {
        V1_ENDPOINT: '/v1/facts',
        FETCH_ERROR: 'Failure during facts get request: ',
        INPUT_ERROR: 'Invalid input parameters',
        H_DATA_FETCH_ERROR: 'Failure while fetching historical data: '
    },
    IDENTITY: {
        V1_ENDPOINT: '/v1/identity',
        BULK_FETCH_ERROR: 'Failure while collecting identites and discounts',
        FETCH_ERROR: 'Failure during identity get request: ',
    },
    LISTENER: {
        V1_ENDPOINT: '/v1/listener'
    }
}

export default CONSTANTS;
