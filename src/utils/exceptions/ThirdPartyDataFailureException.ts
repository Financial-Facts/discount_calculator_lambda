import HttpException from "@/utils/exceptions/HttpException";

class ThirdPartyDataFailureException extends HttpException {

    constructor(message: string) {
        super(503, message);
    }

}

export default ThirdPartyDataFailureException;