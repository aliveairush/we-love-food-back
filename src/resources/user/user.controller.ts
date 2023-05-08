import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../utils/interfaces/controller.interface.js";
import HttpException from "../../utils/exception/http.exception.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import validate from "../../resources/user/user.validation.js";
import UserService from "./user.service.js";
import authenticated from "../../middleware/authenticated.middleware.js";

class UserController implements Controller {
    path = "/users";
    router: Router = Router();
    private UserService = new UserService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );

        this.router.get(`${this.path}`, authenticated, this.getUser);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;

            const token = await this.UserService.register(
                name,
                email,
                password,
                "user"
            );

            res.status(201).json({
                token
            });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;

            const token = await this.UserService.login(email, password);

            res.status(200).json({
                token
            });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        console.log("Req", req);

        const user = req.user;
        if (!user) {
            console.log("No user");

            return next(new HttpException(404, "No logged in User"));
        }
        console.log("User");
        res.status(200).json({ user });
    };
}

export default UserController;
