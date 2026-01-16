import UserModel, { genderEnum, providerEnum } from "../../DB/models/user.model.js"
import { successResponse } from "../../Utils/successResponse.utils.js"
import * as dbService from "../../DB/db.service.js"
import { asymmetricEncrypt} from "../../Utils/Encryption/encryption.utils.js";
import { hash, compare } from "../../Utils/Hashing/hashing.utils.js";
import { eventEmitter } from "../../Utils/Events/emailEvevts.utils.js";
import { customAlphabet } from "nanoid";
import { v4 as uuid } from "uuid";
import { generateToken, getNewLoginCredentials ,verifyToken } from "../../Utils/Tokens/token.utils.js";
import TokenModel from "../../DB/models/token.model.js";
import { OAuth2Client } from 'google-auth-library';





export const Signup = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        gender,
        phone
    } = req.body



    const checkUser = await dbService.findOne({
        model: UserModel,
        filter: { email }
    });

    if (checkUser) {
        return next(new Error("User already exists", { cause: 409 }))
    }

    const otp = customAlphabet("0123456789qwertyuiopasdfghjklzxcvbnm", 6)();


    const user = await dbService.create({
        model: UserModel,
        data: [{
            firstName,
            lastName,
            email,
            gender,
            password: await hash({ plainText: password }),
            phone: asymmetricEncrypt(phone),
            confirmEmailOTP: await hash({ plainText: otp }),
            confirmEmailOTPExpires: new Date(Date.now() + 5 * 60 * 1000)

        }],

    })

        eventEmitter.emit("confirmEmail", { to: email , firstName , otp });


    return successResponse({ res, statusCode: 201, message: "User created successfully", data: { user } });


};


export const Login = async (req, res, next) => { 
    const { email, password } = req.body

    const checkUser = await dbService.findOne({
        model: UserModel,
        filter: { email }
    });
    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }))
    }
    if (!(await compare({ plainText: password, hash: checkUser.password }))) {
        return next(new Error("Invalid Email or password", { cause: 400 }));
    }
    if(!checkUser.confirmEmail){
        return next(new Error("Please confirm your email before login", { cause: 400 }));
    }
    const creidentials = await getNewLoginCredentials(checkUser);

    return successResponse({
        res,
        statusCode: 200,
        message: "User logged in successfully",
        data: { creidentials}
    });



}


export const ConfirmEmail = async (req, res, next) => { 
    const { email, otp } = req.body

    const checkUser = await dbService.findOne({
        model: UserModel,
        filter: {
            email,
            confirmEmail: { $exists: false },
            confirmEmailOTP: { $exists: true }
        },
    });
    if (!checkUser) {
        return next(new Error("User not found or email already confirmed", { cause: 404 }))
    }

    if (!(await compare({ plainText: otp, hash: checkUser.confirmEmailOTP }))) {
        return next(new Error("Invalid OTP", { cause: 400 }));
    }
    if (checkUser.confirmEmailOTPExpires < Date.now()) {
        return next(new Error("OTP has expired", { cause: 400 }));
    }

    await dbService.updateOne({
        model: UserModel,
        filter: { email },
        data: {
            confirmEmail: Date.now(),
            $unset: { confirmEmailOTP: true , confirmEmailOTPExpires: true },
            $inc:{__v:1}
        }
    })

    return successResponse({
        res,
        statusCode: 200,
        message: "Email confirmed successfully",
    });



}


export const Logout = async (req, res, next) => {

    await dbService.create({
        model: TokenModel,
        data: [{
            jwtId: req.decoded.jti,
            expiresIn: new Date(req.decoded.exp * 1000),
            userId: req.user._id
        }]
    });

    return successResponse({
        res,
        statusCode: 200,
        message: "User logged out successfully",
    });
}


export const RefreshToken = async (req, res, next) => {
    const User = req.user;

     const creidentials = await getNewLoginCredentials(User);

    return successResponse({
        res,
        statusCode: 200,
        message: "Token refreshed successfully",
        data: { creidentials }
    });
}


export const ForgetPassword = async (req, res, next) => {
    const { email } = req.body;

    const generateOTP = customAlphabet("1234567890abcdefjhijklmnopqrstuvwxyz", 6);
    const otp = generateOTP();


    const user = await dbService.findOneAndUpdate({
        model: UserModel,
        filter: {
            email,
            confirmEmail: { $exists: true },
        },
        data: {
            forgetPasswordOTP: await hash({ plainText: otp }),
            forgetPasswordOTPExpires : new Date(Date.now() + 5 * 60 * 1000),
        },
        
    });

    

    if (!user) {
        return next(new Error("User not found or email not confirmed", { cause: 404 }));
    };

    eventEmitter.emit("forgetPassword", {
        to: email,
        firstName: user.firstName,
        otp,
    });

    return successResponse({
        res,
        statusCode: 200,
        message: "Check your email to reset your password",
    });

};


export const ResetPassword = async (req, res, next) => {
    const { email, otp, password } = req.body;

    const user = await dbService.findOne({
        model: UserModel,
        filter: {
            email,
            confirmEmail: { $exists: true },
            forgetPasswordOTP: { $exists: true },
            forgetPasswordOTPExpires: { $exists: true },
        },
    });

    if (!user) {
        return next(new Error("Invalid Account", { cause: 404 }));
    };

     if (user.forgetPasswordOTPExpires < Date.now()) {
        return next(new Error("OTP has expired", { cause: 400 }));
    };

    if (!(await compare({ plainText: otp, hash: user.forgetPasswordOTP }))) {
        return next(new Error("Invalid OTP", { cause: 400 }));
    };


 

    await dbService.updateOne({
        model: UserModel,
        filter: { email },
        data: {
            password: await hash({ plainText: password }),
            $unset: { forgetPasswordOTP: true, forgetPasswordOTPExpires: true },
            $inc: { __v: 1 }
        }
    });

    return successResponse({
        res,
        statusCode: 200,
        message: "Password reset successfully",
    });

};



async function verifyGooleAccount({ idToken }) {
    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload
    }
};

 
export const loginWithGmail = async (req, res, next) => {
    const { idToken } = req.body;


    const { email, email_verified, given_name, family_name, picture } =
        await verifyGooleAccount({ idToken })
        
    if (!email_verified) {
        return next(new Error("Email not verified", { cause: 401 }));
    }

    const user = await dbService.findOne({
        model: UserModel,
        filter: { email }
    });



    if (user) {
        if (user.providers === providerEnum.google) {

            const creidentials = await getNewLoginCredentials(user);

            return successResponse({
                res,
                statusCode: 200,
                message: "User logged in successfully",
                data: {creidentials }
            });
        }
    }

    const newUser = await dbService.create({
        model: UserModel,
        data: [{
            email,
            firstName: given_name,
            lastName: family_name,
            profileImage: picture,
            provider: providerEnum.google
        }]
    });

    const creidentials = await getNewLoginCredentials(newUser);


    return successResponse({
        res,
        statusCode: 200,
        message: "User signed up successfully",
        data: {creidentials }
    });

};