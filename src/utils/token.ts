import jwt from "jsonwebtoken";
import User from "../resources/user/user.interface.js";
import Token from "./interfaces/token.interface.js";

/** Логика для создания JWT токена */
export const createToken = (user: User): string => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET as jwt.Secret,
        {
            expiresIn: "1d"
        }
    );
};

/** Логика для проверки JWT токена на совпадение с секретным словом */
export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        // Метод verify проверяет токен (1 параметр) по секрету (2 параметр)
        // и затем вызывает колбек (3 параметр)
        jwt.verify(
            token,
            process.env.JWT_SECRET as jwt.Secret,
            (err, payload) => {
                if (err) return reject(err);

                resolve(payload as Token);
            }
        );
    });
};

export default { createToken, verifyToken };
