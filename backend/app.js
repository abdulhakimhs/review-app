const express = require("express")
require('./db')
const userRouter = require("./routes/user")
const config = require("./config")

const app = express()
app.use(express.json())
app.use("/api/user", userRouter)

app.get("/about", (req, res) => {
    res.send("<h1>Hello I am from you backend about</h1>")
});

app.listen(config.port, () => {
    console.log(`the port is listening on ${config.port}`)
})