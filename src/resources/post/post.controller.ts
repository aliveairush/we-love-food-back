import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../utils/interfaces/controller.interface.js";
import HttpException from "../../utils/exception/http.exception.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import PostService from "../../resources/post/post.service.js";
import validate from "../../resources/post/post.validation.js";

class PostController implements Controller {
    public path = "/posts";
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            this.create
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;

            const post = await this.PostService.createPost({ title, body });

            res.status(201).json({ post });
        } catch (error) {
            next(new HttpException(400, "Cannot create Post"));
        }
    };
}

export default PostController;
