const express = require("express")
const login = require("./login")
const signup = require("./signup")
const sendPush = require("./sendPush")
const logout = require("./logout")

const router = express.Router()

router.post("/login", login.Login)
router.post("/signup", signup.Signup)
router.post("/sendPush", sendPush.SendPush)
router.post("/logout", logout.Logout)

module.exports = router