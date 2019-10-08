const express = require("express")
const login = require("./login")
const signup = require("./signup")
const sendPush = require("./sendPush")
const logout = require("./logout")
const info21 = require("./info21")

const router = express.Router()

router.post("/login", login.Login)
router.post("/signup", signup.Signup)
router.post("/sendPush", sendPush.SendPush)
router.post("/logout", logout.Logout)
router.post("/info21", info21.Info21)

module.exports = router