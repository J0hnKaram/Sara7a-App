import { Router } from "express";
import * as messageService from "./message.service.js";
import { validation } from "../../Middleware/validation.middleware.js";
import { sendMessageSchema } from "./message.validation.js";

const router = Router()

router.post("/send/:receiverId",validation(sendMessageSchema) ,messageService.sendMessage)

router.get("/getAll-messages", messageService.getAllMessages)


export default router