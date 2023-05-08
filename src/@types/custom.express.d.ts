import User from "../resources/user/user.interface.ts";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
