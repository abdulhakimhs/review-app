const nodemailer = require('nodemailer')
const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken')
const { isValidObjectId } = require('mongoose')
const user = require('../models/user')

exports.create = async (req, res) => {
    const { name, email, password } = req.body

    const checkUser = await User.findOne({ email })
    if (checkUser) {
        return res.status(401).json({ error: "This email is already in use!" })
    }

    const newUser = new User({ name, email, password })
    await newUser.save()

    //generate 6 digit OTP
    let OTP = '';
    for (let i = 0; i <= 5; i++) {
        const randomVal = Math.round(Math.random() * 9);
        OTP += randomVal;
    }

    //store otp to database
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: newUser._id,
        token: OTP,
    })
    await newEmailVerificationToken.save()

    //send otp to user
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "acd47397993deb",
            pass: "a6f7a58f3d4237"
        }
    });

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
            <p>Your Verification OTP</p>
            <h1>${OTP}</h1>
        `
    })

    res.status(201).json({
        message: "Please verify your email, OTP has been sent to your email account!"
    })
}

 exports.verifyEmail = async (req, res) => {
    const {userId, OTP} = req.body
    if(!isValidObjectId(userId)) return res.status(401).json({error: "Invalid User!"})
    const getUser = await User.findById(userId)
    
    if(!getUser) return res.status(401).json({error: "User not found"})

    if(getUser.isVerified) return res.status(401).json({error: "User is already verified!"})
    const token = await EmailVerificationToken.findOne({
        owner: userId
    })

    if(!token) return res.status(401).json({error: "Token not found!"})
    
    const isMatched = await token.compaireToken(OTP)
    if(!isMatched) return res.status(401).json({error: "Please submit a valid OTP"})

    user.isVerified = true
    await getUser.save()

    await EmailVerificationToken.findByIdAndDelete(token._id)

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "acd47397993deb",
            pass: "a6f7a58f3d4237"
        }
    });

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: getUser.email,
        subject: 'Welcome Email',
        html: `<h2>Welcome to our app and thanks for choosing us.</h2>`
    })

    res.status(200).json({message: "Your email sucessfully verified"})
 }