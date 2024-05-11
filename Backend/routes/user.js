const express = require("express");

const { create, verifyEmail, resendEmailVerificationToken, forgetPassword } = require("../controllers/user");
const { validate, userValidator } = require("../middleware/validator");
const { isValidPassResetToken } = require("../middleware/user");

const router = express.Router();

router.post("/create", userValidator, validate, create);// check it's not empty, if is empty, send error message
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post("/verify-pass-reset-token", isValidPassResetToken, (req, res) => {
    res.json({valid: true});
});

module.exports = router;