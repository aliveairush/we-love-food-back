import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token.js";

import UserModel from "../resources/user/user.model.js";
import Token from "../utils/interfaces/token.interface.js";
import HttpException from "../utils/exception/http.exception.js";

import jwt from "jsonwebtoken";

/** Добавляем данный middleware для routes где нужна авторизация пользователя */
async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    console.log("Bearer", bearer);

    if (!bearer || !bearer.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    const accessToken = bearer.split("Bearer ")[1].trim();
    console.log("accessToken", accessToken);
    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }
        console.log("Before exec", payload);
        const user = await UserModel.findById((payload as Token).id)
            .select("-password") // Не берем пароль;
            .exec();
        console.log("After exec", user);

        if (!user) {
            return next(new HttpException(401, "Could find user"));
        }

        req.user = user;

        return next();
    } catch (error) {
        return next(new HttpException(401, error.message));
    }
}

export default authenticatedMiddleware;
