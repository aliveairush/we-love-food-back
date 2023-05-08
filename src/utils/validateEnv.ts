import { cleanEnv, str, port } from "envalid";

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ["development", "production"]
        }),
        PORT: port({ default: 3000 }),
        MONGO_USER: str(),
        MONGO_PASS: str(),
        MONGO_PATH: str(),
        JWT_SECRET: str(),
        CLIENT_APP: str()
    });
}
export default validateEnv;
