const express = require("express")
const login = require("./login")
const signup = require("./signup")
const sendPush = require("./sendPush")
const tokenregistration = require("./tokenregistration")

const router = express.Router()

router.post("/login", login.Login)
router.post("/signup", signup.Signup)
router.post("/sendPush", sendPush.SendPush)
router.post("/tokenregistration", tokenregistration.TokenRegistration)

module.exports = router