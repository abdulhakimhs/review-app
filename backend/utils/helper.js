exports.sendError = (res, error, statusCode = 401) => {
    res.status(statusCode).json({error});
}

exports.sendSuccess = (res, message, statusCode = 200) => {
    res.status(statusCode).json({message});
}