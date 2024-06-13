const express = require("express");

const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn } = require("../controllers/user");
const { validate, userValidator, validatePassword, signInValidator } = require("../middleware/validator");
const { isValidPassResetToken } = require("../middleware/user");

const router = express.Router();

router.post("/create", userValidator, validate, create);// check it's not empty, if is empty, send error message
router.post("/sign-in", signInValidator, validate, signIn);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post("/verify-pass-reset-token", isValidPassResetToken, sendResetPasswordTokenStatus);
router.post("/reset-password", validatePassword, validate, isValidPassResetToken, resetPassword);

module.exports = router;