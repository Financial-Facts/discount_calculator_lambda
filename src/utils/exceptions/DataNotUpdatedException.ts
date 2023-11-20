import HttpException from "@/utils/exceptions/HttpException";

class DataNotUpdatedException extends HttpException {

    constructor(message: string) {
        super(409, message);
    }

}

export default DataNotUpdatedException;