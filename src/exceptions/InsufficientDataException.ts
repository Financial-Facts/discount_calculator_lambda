class InsufficientDataException extends Error {

    constructor(message: string) {
        super(message);
    }
}

export default InsufficientDataException;