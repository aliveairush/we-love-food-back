import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

function validationMiddleware(Schema: Joi.Schema): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true, // Для разрешения если прислали поля которых нет в схеме
            stripUnknown: true // Для удаления лишних значений которые пришли
        };

        try {
            const value = await Schema.validateAsync(
                req.body,
                validationOptions
            );
            req.body = value;
            next();
        } catch (error) {
            const errors: string[] = [];
            error.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push(error.message);
            });
            res.status(400).send({ errors });
        }
    };
}

export default validationMiddleware;
