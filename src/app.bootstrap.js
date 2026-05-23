import express from "express";
import { authRouter, messageRouter, userRouter } from "./module/index.js";
import { connectionDB } from "./DB/connection.DB.js";
import { GlobalErrorHandler } from "./middleware/error.middleware.js";
import { connectionRedis } from "./DB/redis.connection.js";
import { ORIGIN } from "../config/config.js"; // 💡 تم إزالة PORT من هنا لمنع تضارب الأسماء
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

export const bootstrap = async () => {
    const corsOptions = {
        origin: ORIGIN.split(","),
        optionsSuccessStatus: 200,
        credentials: true
    };

    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 1000,
        message: 'Too many requests from this IP, please try again after 5 minutes',
        legacyHeaders: true,
        standardHeaders: 'draft-8',
    });

    app.set('trust proxy', 1);
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(limiter);
    app.use(express.json());

    // الاتصال بقواعد البيانات
    await connectionDB();
    await connectionRedis();

    // الراوتس الأساسية
    app.use("/user", userRouter);
    app.use("/message", messageRouter);
    app.use("/auth", authRouter);

    app.get("/", (req, res, next) => {
        res.send("Hello World! Server is stable and live. 🚀");
    });

    

    app.use(GlobalErrorHandler);

    // 💡 الحل الحاسم: قراءة بورت Railway الديناميكي أو الإجباري (5000) بشكل صحيح
    const appPort = process.env.PORT || 5000;

    app.listen(appPort, "0.0.0.0", () => {
        console.log(`✔😎 Server is perfectly running on port ${appPort}`);
    });
};