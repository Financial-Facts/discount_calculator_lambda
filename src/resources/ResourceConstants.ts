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
        DELETE_ERROR: 'Failure during discount delete request',
        FETCH_ERROR: 'Failure during discount get request: ',
        FETCH_ALL_CIK_ERROR: 'Failure during discount get all simple discount request: '    },
    STATEMENTS: {
        V1_ENDPOINT: '/v1/statements',
        SAVE_ERROR: 'Failure during statement save request: ', 
        FETCH_ERROR: 'Failure during statement get request: ',
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
