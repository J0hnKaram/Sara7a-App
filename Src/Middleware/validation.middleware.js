import joi from "joi";
import { genderEnum } from "../DB/models/user.model.js";
import { Types } from "mongoose";
import e from "express";

export const validation = (schema) => {
    return (req, res, next) => {
        const validationError = [];
        for (const key of Object.keys(schema)) {
            const validationResult = schema[key].validate(req[key], {
                abortEarly: false
            });
            if (validationResult.error) {
                validationError.push({ key, details: validationResult.error.details });
            }
        }

        if (validationError.length) {
            return res.status(400).json({ message : "validation error",  details: validationError });
        }
        return next();
    }
};



export const generalFields = {
            id: joi.string().custom((value, helpers) => {
                return (
                    Types.ObjectId.isValid(value) ||
                    helpers.message("Invalid ObjectId Format")
                );
            }),
            firstName: joi.string().min(2).max(20).messages({
                "string.min": "First Name must be at least 2 characters long",
                "string.max": "First Name must be at most 20 characters long",
                "any.required": "First Name is is required"
            }),
            lastName: joi.string().min(2).max(20).messages({
                "string.min": "Last Name must be at least 2 characters long",
                "string.max": "Last Name must be at most 20 characters long",
                "any.required": "Last Name is is required"
            }),
            email: joi
                .string().email({
                    minDomainSegments: 2,
                    maxDomainSegments: 5,
                    tlds: { allow: ["com", "net", "io", "org"] },
                }),
            
            password: joi.string(),
            confirmPassword: joi.ref("password"),
            gender: joi.string().valid(...Object.values(genderEnum)).default(genderEnum.Male),
            phone: joi.string().pattern(new RegExp(/^01[0125][0-8]{8}$/)),
            otp: joi.string(),
            
            receiverId: joi.string().custom((value , helpers) => {
            return (
                Types.ObjectId.isValid(value) ||
                helpers.message("Invalid ObjectId Format")
            );
            }),
    file: {
        fieldname: joi.string(),
        originalname: joi.string(),
        encoding: joi.string(),
        mimetype: joi.string(),
        size: joi.number().positive(),
        destination: joi.string(),
        filename: joi.string(),
        finalPath: joi.string(),
        path: joi.string(),
    }
            
    }
            
            
