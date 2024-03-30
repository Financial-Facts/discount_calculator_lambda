import HttpException from "@/utils/exceptions/HttpException";

class DatabaseException extends HttpException {

    constructor(message: string) {
        super(409, message);
    }

}

export default DatabaseException;