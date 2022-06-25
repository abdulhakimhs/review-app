
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require("../config");
const EmailVerificationToken = require('../models/emailVerificationToken')
const { isValidObjectId } = require('mongoose')
const { generateOTP, generateMailTransporter } = require('../utils/mail')
const { sendError, sendSuccess, generateRandomByte } = require('../utils/helper')
const passwordResetToken = require('../models/passwordResetToken')

exports.create = async (req, res) => {
    const { name, email, password } = req.body

    const checkUser = await User.findOne({ email })
    if (checkUser) {
        return sendError(res, "This email is already in use!")
    }

    const newUser = new User({ name, email, password })
    await newUser.save()

    //generate 6 digit OTP
    let OTP = generateOTP();

    //store otp to database
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: newUser._id,
        token: OTP,
    })
    await newEmailVerificationToken.save()

    //send otp to user
    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
            <p>Your Verification OTP</p>
            <h1>${OTP}</h1>
        `
    })

    sendSuccess(
        res,
        `user: {
            id: ${newUser._id},
            name: ${newUser.name},
            email: ${newUser.email}
        }`,
        201)
}

exports.verifyEmail = async (req, res) => {
    const {userId, OTP} = req.body
    if(!isValidObjectId(userId)) return sendError(res, "Invalid User")
    const getUser = await User.findById(userId)

    if(!getUser) return sendError(res, "User not found", 404)

    if(getUser.isVerified) return sendError(res, "User is already verified!")
    const token = await EmailVerificationToken.findOne({
        owner: userId
    })

    if(!token) return sendError(res, "Token not found")

    const isMatched = await token.compareToken(OTP)
    if(!isMatched) return sendError(res, "Please submit a valid OTP")

    getUser.isVerified = true
    await getUser.save()

    await EmailVerificationToken.findByIdAndDelete(token._id)

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: getUser.email,
        subject: 'Welcome Email',
        html: `<h2>Welcome to our app and thanks for choosing us.</h2>`
    })

    sendSuccess(res, "Your email sucessfully verified")
}

exports.resendEmailVerificationToken = async (req, res) => {
    const {userId} = req.body
    if(!isValidObjectId(userId)) return sendError(res, "Invalid User")
    const getUser = await User.findById(userId)

    if(!getUser) return sendError(res, "User not found", 404)

    if(getUser.isVerified) return sendError(res, "This email is already verfied!")

    const alreadyHasToken = await EmailVerificationToken.findOne({
        owner: userId
    })
    if(alreadyHasToken) return sendError(res, "Only after one hour you can request for another token")

    //generate 6 digit OTP
    let OTP = generateOTP();

    //store otp to database
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: getUser._id,
        token: OTP,
    })
    await newEmailVerificationToken.save()

    //send otp to user
    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: getUser.email,
        subject: 'Email Verification',
        html: `
            <p>Your Verification OTP</p>
            <h1>${OTP}</h1>
        `
    })

    sendSuccess(res, "Please verify your email, OTP has been sent to your email account!", 201)
}

exports.forgotPassword = async (req, res) => {
    const {email} = req.body
    if(!email) return sendError(res, "Email is missing!")

    const getUser = await User.findOne({email})
    if(!getUser) return sendError(res, "User not found", 404)

    const alreadyHasToken = await passwordResetToken.findOne({owner: getUser._id})
    if(alreadyHasToken) return sendError(res, "Only after one hour you can request for another token")
    
    const token = await generateRandomByte()
    const newPasswordResetToken = await passwordResetToken({owner: getUser._id, token})
    await newPasswordResetToken.save()

    const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${getUser._id}`

    //send otp to user
    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'security@reviewapp.com',
        to: getUser.email,
        subject: 'Reset Password Link',
        html: `
            <p>Click Here to reset your password</p>
            <a href="${resetPasswordUrl}">Change Password</a>
        `
    })

    sendSuccess(res, "Link send to your email.", 200)

}

exports.sendResetPasswordTokenStatus = (req, res) => {
    res.json({valid: true})
}

exports.resetPassword = async (req, res) => {
    const {newPassword, userId} = req.body

    const getUser = await User.findById(userId)
    const matched = await User.comparePassword(newPassword)
    if(matched) return sendError(res, "The new password must be different from the old one")

    getUser.password = newPassword
    await getUser.save()

    await passwordResetToken.findByIdAndDelete(req.resetToken._id)
    
    //send otp to user
    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'security@reviewapp.com',
        to: getUser.email,
        subject: 'Password Reset Succesfully',
        html: `
            <h1>Password Reset Succesfully</h1>
            <p>Now you can login using your new password</p>
        `
    })

    sendSuccess(res, "Password reset successfully, now you can use new password", 200)

}

exports.signIn = async (req, res, next) => {
    const {email, password} = req.body

    const getUser = await User.findOne({email})
    if(!getUser) return sendError(res, "Email not registered!", 404)

    const matched = await getUser.comparePassword(password)
    if(matched) return sendError(res, "Password mismatch!")

    const {_id, name} = getUser;

    const jwtToken = jwt.sign(
        {userId: _id},
        `${config.jwt_secret}`
    );

    res.json({user: {id: _id, name, email, token: jwtToken}})

}