import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication, authorization, tokenTypeEnum } from "../../Middleware/auth.middleware.js";
import {  fileTypes } from "../../Utils/Multer/local.multer.js";
import { validation } from "../../Middleware/validation.middleware.js";
import { freezeAccountSchema , restoreAccountSchema } from "./user.validation.js";
import { cloudFileUploadMulter } from "../../Utils/Multer/cloud.multer.js";
import { roleEnum } from "../../DB/models/user.model.js";


const router = Router()

router.get("/", userService.getAllUsers);

router.patch("/update",
    authentication({tokenType: tokenTypeEnum.ACCESS}),
    authorization({ accessRole: [roleEnum.USER] }),
    userService.updateUserProfile
);


router.patch( "/profile-image",
    authentication({tokenType: tokenTypeEnum.ACCESS}),
    authorization({ accessRole: [roleEnum.USER] }),
    cloudFileUploadMulter({ validation: [...fileTypes.image] }).single("profileImage"),
    userService.ProfileImage
);



router.patch("/cover-image",
    authentication({tokenType: tokenTypeEnum.ACCESS}),
    authorization({ accessRole: [roleEnum.USER] }),
    cloudFileUploadMulter({ validation: [...fileTypes.image] }).array("coversImage", 5),
    userService.CoversImage
);

router.delete("{/:userId}/freeze-account",
    authentication({tokenType: tokenTypeEnum.ACCESS}),
    authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
    validation(freezeAccountSchema),
    userService.freezeAccount
)

router.patch("/:userId/restore-account",
    authentication({tokenType: tokenTypeEnum.ACCESS}),
    authorization({ accessRole: [roleEnum.USER, roleEnum.ADMIN] }),
    validation(restoreAccountSchema),
    userService.restoreAccount
)



export default router