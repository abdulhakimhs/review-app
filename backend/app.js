const express = require("express")
const morgan = require("morgan")
require('express-async-errors')
require('./db')
const userRouter = require("./routes/user")
const config = require("./config")
const { errorHandler } = require("./middlewares/error")

const app = express()
app.use(express.json())
app.use(morgan("dev"))
app.use("/api/user", userRouter)

app.use(errorHandler)

app.get("/about", (req, res) => {
    res.send("<h1>Hello I am from you backend about</h1>")
});

app.listen(config.port, () => {
    console.log(`the port is listening on ${config.port}`)
})