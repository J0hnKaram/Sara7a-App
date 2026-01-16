import morgan from "morgan";
import connectDB from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controllor.js";
import messageRouter from "./Modules/message/message.controllor.js";
import userRouter from "./Modules/User/user.controllor.js";
import { globalErrorHandler } from "./Utils/errorHandler.utils.js";
import cors from "cors";
import path from "node:path";
import { attachRouterWriteLogger } from "./Utils/Logger/logger.utils.js";
import helmet from "helmet";
import { corsOption } from "../Src/Utils/Cors/cors.utils.js";
import {rateLimit} from "express-rate-limit";



const bootstrap = async (app, express) => {
    app.use(express.json({ limit: "1kb" }))
    app.use(cors(corsOption()))
    app.use(helmet())
    await connectDB();
    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 5,  
        message: {  
            status: 429,
            message: "Too many requests from this IP, please try again after few minutes",
        },
        standardHeaders: true, 
        legacyHeaders: false, 
      });
    app.use(limiter);

    attachRouterWriteLogger(app , "/api/v1/auth", authRouter, "auth.log")
    attachRouterWriteLogger(app , "/api/v1/message", messageRouter, "message.log")
    attachRouterWriteLogger(app , "/api/v1/user", userRouter, "user.log")

    app.get("/", (req, res) => {
        return res.status(200).json({ Message: "Done" })
    })

    app.use("/Uploads", express.static(path.resolve("./Src/Uploads")))
    app.use("/api/v1/auth", authRouter)
    app.use("/api/v1/message", messageRouter)
    app.use("/api/v1/user", userRouter)

    app.all("/*dummy", (req, res) => {
        return res.status(404).json({ Message: "not found handler!!!!!!!!!!!!! " })
    })

    app.use(globalErrorHandler)




}

export default bootstrap