class DataRetrievalException extends Error {

    private messageTypeMap: any;

    constructor(message: string) {
        super(message);
    }


}

export default DataRetrievalException;