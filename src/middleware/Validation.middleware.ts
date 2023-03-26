import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from 'joi';

function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnkown: false,
        };

        try {
            const value = await schema.validateAsync(
                request.body,
                validationOptions
            );
            request.body = value;
            next();
        } catch (err: any) {
            const errors: string[] = [];
            err.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push(error.message);
            });
            response.status(400).send({ errors: errors });
        }
    }
}

export default validationMiddleware;