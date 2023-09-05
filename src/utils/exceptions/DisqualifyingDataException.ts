import HttpException from "@/utils/exceptions/HttpException";

class DisqualifyingDataException extends HttpException {

    constructor(message: string) {
        super(409, message);
    }

}

export default DisqualifyingDataException;