const express = require("express");

const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn } = require("../controllers/user");
const { validate, userValidator, validatePassword, signInValidator } = require("../middleware/validator");
const { isValidPassResetToken } = require("../middleware/user");
const { sendError } = require("../utils/helper");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/create", userValidator, validate, create);// check it's not empty, if is empty, send error message
router.post("/sign-in", signInValidator, validate, signIn);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post("/verify-pass-reset-token", isValidPassResetToken, sendResetPasswordTokenStatus);
router.post("/reset-password", validatePassword, validate, isValidPassResetToken, resetPassword);

router.get("/is-auth", isAuth, (req, res) => {// isAuth middle ware 把认证后的用户信息 user 添加到请求对象（req）上，然后交给下一个中间件或路由处理函数继续处理
    const {user} = req;
    res.json({user : { id: user._id, name: user.name, email: user.email }});
});

module.exports = router;