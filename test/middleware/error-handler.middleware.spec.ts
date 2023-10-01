import { assert } from "chai";
import errorMiddleware from "../../src/middleware/error-handler.middleware";
import sinon from "sinon";

describe("Error Middleware Tests", () => {

    let error: any;
    let request: any;
    let send: any;
    let response: any;
    let fakeSend: sinon.SinonSpy;
    let fakeResponse: sinon.SinonSpy;

    beforeEach(() => {
        error = { status: undefined, message: undefined };
        request = {};
        send = { send: () => {} };
        response = { status: () => send };
        fakeResponse = sinon.replace(response, 'status', sinon.fake(response.status));
        fakeSend = sinon.replace(send, 'send', sinon.fake(send.send));
    });

    it('should send response when invoked', () => {
        errorMiddleware(error, request, response, () => {});
        assert.isTrue(fakeResponse.calledOnce);
        assert.isTrue(fakeSend.calledOnce);
    });

    it('should send response with provided status', () => {
        error.status = 401;
        error.message = 'error';
        errorMiddleware(error, request, response, () => {});
        assert.isTrue(fakeResponse.calledWith(401));
        assert.isTrue(fakeSend.calledWith({
            status: 401,
            message: error.message
        }));
    });

    it('should send response with status ', () => {
        errorMiddleware(error, request, response, () => {});
        assert.isTrue(fakeResponse.calledWith(500));
        assert.isTrue(fakeSend.calledWith({
            status: 500,
            message: 'Something went wrong'
        }));
    });

});