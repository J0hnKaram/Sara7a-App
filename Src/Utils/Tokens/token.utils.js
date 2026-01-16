import jwt from 'jsonwebtoken';
import crypto, { sign } from 'crypto';
import { v4 as uuid } from 'uuid';
import { roleEnum } from '../../DB/models/user.model.js';

export const signatureEnum = {
    ADMIN: "ADMIN",
    USER: "USER"
}

export const generateToken = ({
    payload,
    secretKey = process.env.ACCESS_TOKEN_SECRET_KEY,
    options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIATRES_IN) }
}) => {
    return jwt.sign(payload, secretKey, {
        ...options,
        jwtid: crypto.randomUUID()
    });
};

export const verifyToken = ({
    token,
    secretKey = process.env.ACCESS_TOKEN_SECRET_KEY,
}) => {
    return jwt.verify(token, secretKey);
};


export const getSignature = async({ signatureLevel = signatureEnum.USER }) => {
    let signatures = { accessSignature: undefined, refershSignature: undefined };

    switch (signatureLevel) {
        case signatureEnum.ADMIN:
            signatures.accessSignature = process.env.ACCESS_TOKEN_ADMIN_SECRET_KEY;
            signatures.refershSignature = process.env.REFRESH_TOKEN_ADMIN_SECRET_KEY
            break;
        default:
            signatures.accessSignature = process.env.ACCESS_TOKEN_USER_SECRET_KEY;
            signatures.refershSignature = process.env.REFRESH_TOKEN_USER_SECRET_KEY
            break;
    }

    return signatures
}


export const getNewLoginCredentials = async(user) => {
    const signatures = await getSignature({
        signatureLevel:
            user.role != roleEnum.USER ? signatureEnum.ADMIN : signatureEnum.USER , 
    });

    const jwtid = uuid();

    const accessToken = generateToken({
        payload: { id: user._id, email: user.email },
        secretKey: signatures.accessSignature,
        options: {
            expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIATRES_IN),
            jwtid,
        }
    });
    
    const refreshToken = generateToken({
        payload: { id: user._id, email: user.email },
        secretKey: signatures.refershSignature,
        options: {
            expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIATRES_IN),
            jwtid,
        }
    });

    return { accessToken, refreshToken };
}

 