import "dotenv/config";
import App from "./app.js";
import validateEnv from "./utils/validateEnv.js";
import PostController from "./resources/post/post.controller.js";

validateEnv();

const app = new App([new PostController()], Number(process.env.PORT));

app.listen();

// app.use(
//     cors({
//         origin: "http://localhost:4200"
//     })
// );
