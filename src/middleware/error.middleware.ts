import { Request, Response, NextFunction } from "express";

import HttpException from "../utils/exception/http.exception.js";

function errorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";

    res.status(status).send({
        status,
        message
    });
}

export default errorMiddleware;
