import joi from "joi";
import { generalFields } from "../../Middleware/validation.middleware.js";
import { fileTypes } from "../../Utils/Multer/local.multer.js";


export const profileImageSchema = {
    file: joi.object({
        fieldname: generalFields.file.fieldname.valid("profileImage").required(),
        originalname: generalFields.file.originalname.required(),
        encoding: generalFields.file.encoding.required(),
        mimetype: generalFields.file.mimetype
            .valid(...fileTypes.image).required(),
        size: generalFields.file.size.max(5 * 1024 * 1024).required(), 
        destination: generalFields.file.destination.required(),
        filename: generalFields.file.filename.required(),
        path: generalFields.file.path.required(),
        finalPath: generalFields.file.finalPath.required(),
    }).required(),
}


export const coverImageSchema = {
    files: joi.array().items(
        joi.object({
        fieldname: generalFields.file.fieldname.valid("coversImage").required(),
        originalname: generalFields.file.originalname.required(),
        encoding: generalFields.file.encoding.required(),
        mimetype: generalFields.file.mimetype
            .valid(...fileTypes.image).required(),
        size: generalFields.file.size.max(5 * 1024 * 1024).required(),
        destination: generalFields.file.destination.required(),
        filename: generalFields.file.filename.required(),
        path: generalFields.file.path.required(),
        finalPath: generalFields.file.finalPath.required(),

    })).required(),
}

export const freezeAccountSchema = {
    params: joi.object({
        userId: generalFields.id,
    })
};

export const restoreAccountSchema = {
    params: joi.object({
        userId: generalFields.id.required(),
    })
}