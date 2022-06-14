
const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken')
const { isValidObjectId } = require('mongoose')
const { generateOTP, generateMailTransporter } = require('../utils/mail')
const { sendError, sendSuccess } = require('../utils/helper')

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

    sendSuccess(res, "Please verify your email, OTP has been sent to your email account!", 201)
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

    const isMatched = await token.compaireToken(OTP)
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