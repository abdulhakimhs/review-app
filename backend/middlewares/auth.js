const jwt = require('jsonwebtoken')
const { sendError } = require("../utils/helper")
const config = require("../config");
const User = require("../models/user")

exports.isAuth = async (req, res, next) => {
    const token = req.headers?.authorization
    const jwtToken = token.split("Bearer ")[1]

    if(!jwtToken) return sendError(res, "Invalid Token")
    const decode = jwt.verify(jwtToken, config.jwt_secret)
    const {userId} = decode

    const user = await User.findById(userId)
    if(!user) return sendError(res, "invalid token user not found!", 404)

    req.user = user
    next()
}