import * as dbService from "../../DB/db.service.js";
import UserModel from "../../DB/models/user.model.js";
import MessageModel from "../../DB/models/message.model.js";
import { successResponse } from "../../Utils/successResponse.utils.js"
import { populate } from "dotenv";



export const sendMessage = async (req, res, next) => {
    const { content } = req.body;
    const { receiverId } = req.params;

    const user = await dbService.findById({
        model: UserModel,
        id: receiverId
    });

    if (!user) {
        return next(new Error("User not found",{ cause: 404 }));
    }
    
    const message = await dbService.create({
        model: MessageModel,
        data: [{
            content,
            receiverId: user._id,
        },],
    });

    return successResponse({
        res,
        statusCode: 200,
        message: "Message sent successfully",
        data: { message },
    });

}


export const getAllMessages = async (req, res, next) => {

    const messages = await dbService.findAll({
        model: MessageModel,
        populate:[{path:"receiverId" , select:"firstName lastName email gender"}]
    });

    if(!messages){
        return next(new Error("Messages not found", { cause: 404 }));
    }

    return successResponse({
        res,
        statusCode: 200,
        message: "Messages fetched successfully",
        data: { messages },
    });

   
}


