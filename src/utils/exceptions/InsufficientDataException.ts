import HttpException from "@/utils/exceptions/HttpException";

class InsufficientDataException extends HttpException {

    constructor(message: string) {
        super(409, message);
    }
}

export default InsufficientDataException;