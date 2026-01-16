import * as dbService from "../../DB/db.service.js"
import UserModel from "../../DB/models/user.model.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import {cloudinaryConfig} from "../../Utils/Multer/cloudinary.confg.js";


export const getAllUsers = async (req, res, next) => {
    let users = await dbService.findAll({
        model: UserModel,
        populate: [{ path: "messages", select: "content -_id -receiverId" }],
    });


    return successResponse({
        res,
        statusCode: 200,
        message: "Users fetched successfully",
        data: { users },
    });

}


export const updateUserProfile = async (req, res, next) => {
    const { firstName, lastName, gender } = req.body;

    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: req.decoded.payload.id, 
        data: { firstName, lastName, gender },
    });

    return successResponse({
        res,
        statusCode: 200,
        message: "User profile updated successfully",
        data: { user },
    })

}

export const ProfileImage = async (req, res, next) => {

    const result = await cloudinaryConfig().uploader.upload(req.file.path, {
        folder: `Sara7aApp/Users/${req.user._id}/profileImage`
    });

    const { public_id, secure_url } = result;

    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: req.user._id,
        data: { cloudprofileImage: public_id, secure_url },
    })

    if (req.user.cloudprofileImage?.public_id) {
        await cloudinaryConfig().uploader.destroy(
            req.user.cloudprofileImage.public_id)
    }


    return successResponse({
        res,
        statusCode: 200,
        message: "User profile image updated successfully",
        data: { user },
    })
}

export const CoversImage = async (req, res, next) => {    
    const attachments = [];
    for (const file of req.files) {
      const {public_id, secure_url} = await cloudinaryConfig().uploader.upload(file.path, {
        folder: `Sara7aApp/Users/${req.user._id}/coversImage`,
      });
      attachments.push({public_id, secure_url});
    }

    const user = await dbService.findByIdAndUpdate({
      model: UserModel,
      id: req.user._id,
      data: { cloudcoverImage: attachments },
    });

    return successResponse({
      res,
      statusCode: 200,
      message: "User covers images updated successfully",
      data: { user },
    });

};

export const freezeAccount = async (req, res, next) => {
    const { userId } = req.params;

    if (userId && req.user.role !== roleEnum.ADMIN) {
        return next(new Error("Not authorized to freeze this account"));
    }

    const updatedUser = await dbService.findOneAndUpdate({
        model: UserModel,
        filter: { _id: userId || req.user._id, freezeAt: { $exists: false } },
        data: {
            freezeAt: Date.now(), 
            freezeBy: req.user._id,
        },
    })

    return updatedUser ? successResponse({
        res,
        statusCode: 200,
        message: "Profile Freeze SuccessFuly",
        date: { user: updatedUser }
    }) : next (new Error ("Invalid Account"))

}

export const restoreAccount = async (req, res, next) => {
    const { userId } = req.params;

    const updatedUser = await dbService.findOneAndUpdate({
        model: UserModel,
        filter: { _id: userId , freezeAt: { $exists: true } , freezeBy: {$exists:true} },
        data: {
            $unset: {
                freezeAt: true,
                freezeBy: true,
            },
            restoredeAt: Date.now(),
            restoredBy: req.user._id
        },
    })

    return updatedUser ? successResponse({
        res,
        statusCode: 200,
        message: "Profile Restored SuccessFuly",
        date: {user: updatedUser}
    }) : next (new Error ("Invalid Account"))

}