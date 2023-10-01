import HttpException from "@/utils/exceptions/HttpException";

class ScrapeDataException extends HttpException {

    constructor(message: string) {
        super(409, message);
    }

}

export default ScrapeDataException;