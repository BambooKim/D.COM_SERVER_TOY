const pool = require("../pool")

exports.Logout = (req, res) => {
    const sessionId = req.body.sessionId
    const token = req.body.token

    console.log("Logout Post")
    console.log(sessionId + " : " + token)

    const deleteToken = async () => {
        try {
            const connection = await pool.getConnection(async conn => conn)
            try {
                $query = "DELETE FROM token WHERE Token = ?"
                const result = await connection.query($query, [token])
                connection.release()

                return Promise.resolve()
            } catch (err) {
                console.log(err)
                return Promise.reject()
            }
        } catch (err) {
            console.log(err)
            return Promise.reject()
        }
    }

    deleteToken()
    .then(() => {
        res.send("Success")
        res.end()
    })
    .catch((err) => {
        console.log(err)
    })
}