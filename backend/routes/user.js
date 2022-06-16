const express = require("express");
const { create, verifyEmail, resendEmailVerificationToken, forgotPassword, sendResetPasswordTokenStatus, resetPassword } = require("../controllers/user");
const { isValidPassResetToken } = require("../middlewares/user");
const { userValidator,validate, validatePassword } = require("../middlewares/validator");

const router = express.Router();

router.post(
    "/create",
    userValidator,
    validate,
    create
);

router.post(
    "/verify-email",
    verifyEmail
);

router.post(
    "/resend-email-verification",
    resendEmailVerificationToken
);

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/verify-password-reset-token",
    isValidPassResetToken,
    sendResetPasswordTokenStatus
);

router.post(
    "/reset-password",
    validatePassword,
    validate,
    isValidPassResetToken,
    resetPassword
);

module.exports = router;
