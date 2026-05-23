import express from "express";
import { authRouter, messageRouter, userRouter } from "./module/index.js";
import { connectionDB } from "./DB/connection.DB.js";
import { GlobalErrorHandler } from "./middleware/error.middleware.js";
import { connectionRedis } from "./DB/redis.connection.js";
import { ORIGIN, PORT } from "../config/config.js";
import cors from "cors"
import helmet from "helmet";
import  rateLimit  from "express-rate-limit"

const app = express();
 
export const bootstrap = async () => { 
    const corsOptions = {  
        origin: ORIGIN.split(","), 
        optionsSuccessStatus: 200,
        credentials: true
    }
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
    await connectionDB()
    await connectionRedis()
    app.use("/user", userRouter)
    app.use("/message", messageRouter)
    app.use("/auth", authRouter)


    app.get("/", (req, res, next) => {
        res.send("!hello world")
    })

    app.all("{/*dummy}", (req, res, next) => {
        res.status(400).json({ message: 'invalid application Routing' })
    })
    app.use(GlobalErrorHandler)
    // 1️⃣ قراءة البورت الديناميكي الموفر من Railway، وإلا استخدام 5000 محلياً
const PORT = process.env.PORT || 5000;

// 2️⃣ تمرير البورت مع المضيف "0.0.0.0" وهو إلزامي في بيئات الـ Cloud لـ Railway
app.listen(PORT, "0.0.0.0", () => {
    console.log(`server is running on port ${PORT}`);
});

