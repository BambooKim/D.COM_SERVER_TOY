require("dotenv").config()

exports.TokenRegistration = (req, res) => {
    console.log("Post tokenregistration")

    const token = req.body.token
    const sessionId = req.body.sessionId

    console.log(sessionId + " : " + token);

    res.send("Success")
    res.end()
}