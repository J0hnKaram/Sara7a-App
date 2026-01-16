import * as dbService from "../DB/db.service.js";
import TokenModel from "../DB/models/token.model.js";
import UserModel from "../DB/models/user.model.js";
import { verifyToken } from "../Utils/Tokens/token.utils.js";
import { getSignature } from "../Utils/Tokens/token.utils.js"; 

export const tokenTypeEnum = {
    ACCESS: "ACCESS",
    REFRESH: "REFRESH"
}

const decodedToken = async ({ authorization, tokenType = tokenTypeEnum.ACCESS, next } = {}) => {
    
    if (!authorization) {
        return next(new Error("Unauthorized access, missing token", { cause: 400 }));
    }

    const [ Bearer, token ] = authorization.split(" ") || [];
    if(!Bearer || !token) {
        return next(new Error("Unauthorized access, missing token", { cause: 400 }));
    }

    let signatures = await getSignature({  signatureLevel: Bearer });

    
    const decoded = verifyToken({
        token,
        secretKey:
            tokenType === tokenTypeEnum.ACCESS
                ? signatures.accessSignature
                : signatures.refershSignature,
    });

    if (!decoded.jti) {
        return next(new Error("Invalid token format", { cause: 401 }));
    }

    const revokedToken = await dbService.findOne({
        model: TokenModel,
        filter: { jwtId: decoded.jti }
    });

    if (revokedToken) {
        return next(new Error("Token is Revoked", { cause: 401 }));
    }
    const user = await dbService.findById({
        model: UserModel,
       id: decoded.id
    });
        
    if (!user) {
        return next(new Error("Not Registered Account", { cause: 404 }));
    }

    return { user, decoded };
}


export const authentication = ({ tokenType = tokenTypeEnum.ACCESS } = {}) => { 
    
    return async (req, res, next) => {

        const { user, decoded } = (
            await decodedToken({
                authorization: req.headers.authorization,
                tokenType,
                next,
                
            }))|| {};
        req.user = user;
        req.decoded = decoded;
        return next();
    }
}


export const authorization = ({ accessRole = [] } = {}) => {
    return (req, res, next) => {
        if(!accessRole.includes(req.user.role)) {
            return next(new Error("Unauthorized access", { cause: 403 }));
        }
        next();
    }
}