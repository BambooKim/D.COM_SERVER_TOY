const pool = require("../pool")

exports.Signup = (req, res) => {
    console.log("Who get in here post /signup")

    const name = req.body.name
    const numId = req.body.numId
    const dept = req.body.dept
    const pw = req.body.pw
    const email = req.body.email

    console.log(name, numId, dept, pw, email)

    res.send("test")
    res.end()
}