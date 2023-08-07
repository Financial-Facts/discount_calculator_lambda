import HttpException from "@/utils/exceptions/HttpException";

class InvalidRequestException extends HttpException {

    constructor(message: string) {
        super(400, message);
    }
}

export default InvalidRequestException;