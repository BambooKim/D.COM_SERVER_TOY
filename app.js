const express = require("express")
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use("/api", require("./api"))

app.post("/signup", (req, res) => {
    console.log(req.body)
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})