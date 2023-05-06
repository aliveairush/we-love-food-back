import express, { Application } from "express";
import Controller from "./utils/interfaces/controller.interface.js";
import errorMiddleware from "./middleware/error.middleware.js";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import "dotenv/config";

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initMongoDbConnection();
        this.initMiddleware();
        this.initControllers(controllers);
        this.initErrorHandling();
    }

    private initMiddleware(): void {
        this.express.use(helmet()); // Либа добавляет несколько функций для защиты сервера от известных аттак типа XSS, CSRF
        this.express.use(cors({ origin: "http://localhost:4200" })); // Разрешаем доступ для клиента
        this.express.use(morgan("dev")); // Логер для http запросов. Чтобы видно было какие запросы пришли в удобном формате

        // Middleware для парсинга запросов c application/json и засовывает в req.body.
        // {"Name": "Pikachu", "Type": "Banana", "Number In Stable": 12}
        this.express.use(express.json());
        // Middleware для парсинга запросов c application/x-ww-form-urlencoded
        //  expects request data to be sent encoded in the URL /Name=Pikachu&Type=Banana&Number+In+Stable=12
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression()); // Для уменьшения размера ответа. Включает Content-Encoding: gzip,

        this.express.get("/hello", (req, res) =>
            res.json({ answer: "Hello world" })
        );
    }

    private initControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.express.use("/api", controller.router);
        });
    }

    private initErrorHandling(): void {
        this.express.use(errorMiddleware);
    }

    private initMongoDbConnection(): void {
        const MONGO_USER = process.env.MONGO_USER;
        const MONGO_PASS = process.env.MONGO_PASS;
        const MONGO_PATH = process.env.MONGO_PATH;
        const uriMongo = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_PATH}`;
        async function connectToMongo() {
            try {
                await mongoose.connect(uriMongo);
                console.log("Connected to MongoDB");
            } catch (error) {
                console.error(error);
            }
        }
        connectToMongo();
    }

    public listen(): void {
        this.express.listen(3000, () => console.log("Server is running"));
    }
}

export default App;
