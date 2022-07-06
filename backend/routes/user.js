const express = require("express");
const { create, verifyEmail, resendEmailVerificationToken, forgotPassword, sendResetPasswordTokenStatus, resetPassword, signIn } = require("../controllers/user");
const { isAuth } = require("../middlewares/auth");
const { isValidPassResetToken } = require("../middlewares/user");
const { userValidator,validate, validatePassword, signInValidator } = require("../middlewares/validator");

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

router.post(
    "/sign-in",
    signInValidator,
    validate,
    signIn
);

router.get("/is-auth", isAuth, (req, res) => {
    const {user} = req;
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerfied: user.isVerfied
        }
    })
})



module.exports = router;
