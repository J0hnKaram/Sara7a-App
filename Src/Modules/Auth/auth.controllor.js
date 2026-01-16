import { Router } from "express";
import * as authService from "./auth.service.js"
import { authentication, tokenTypeEnum } from "../../Middleware/auth.middleware.js"
import { confirmEmailSchema, loginSchema, signupSchema , forgetPasswordSchema , resetPasswordSchema} from "./auth.validation.js";
import { validation } from "../../Middleware/validation.middleware.js";


const router = Router()

router.post("/signup",validation(signupSchema),authService.Signup)

router.post("/login",validation(loginSchema), authService.Login)

router.patch("/confirm-email",validation(confirmEmailSchema), authService.ConfirmEmail)

router.post("/logout", authentication, authService.Logout)

router.post("/refresh-token",authentication({tokenType: tokenTypeEnum.REFRESH}) , authService.RefreshToken)

router.patch("/forget-password", validation(forgetPasswordSchema) ,authService.ForgetPassword)

router.patch("/reset-password", validation(resetPasswordSchema), authService.ResetPassword)

router.post("/social-login", authService.loginWithGmail )





export default router               