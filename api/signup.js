const pool = require("../pool")
const crypto = require("crypto")

exports.Signup = (req, res) => {
    console.log("Who get in here post /signup")

    const name = req.body.name
    const numId = req.body.numId
    const dept = req.body.dept
    const userId = req.body.userId
    const pw = req.body.pw
    const email = req.body.email

    const UserCheck = async () => {
        try {
            const connection = await pool.getConnection(async conn => conn)
            try {
                $query = "SELECT * FROM members WHERE NumId = ? || UserId = ?"
                const [rows] = await connection.query($query, [numId, userId])
                connection.release()

                if (rows[0]) {
                    return Promise.reject({
                        code: "user_already_exists",
                        message: "User already exists"
                    })
                } else {
                    return Promise.resolve()
                }
            } catch (err) {
                console.log(err)
                return Promise.reject({
                    code:'database_query_error',
                    message:'database_query_error'
                })
            }
        } catch (err) {
            console.log(err)
            return Promise.reject({
                code:'database_connection_error',
                message:'Failed to connect database'
            })
        }
    }

    const Create = async () => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) throw err
            
            let salt = buf.toString("base64")
            let key = crypto.pbkdf2Sync(pw, salt, Number(process.env.CRYPTO_ITERATION), 64, "sha512")
            let derivedKey = key.toString("base64")
            const doCreate = async () => {
                try {
                    const connection = await pool.getConnection(async conn => conn)
                    try {
                        $query = "INSERT INTO members (Name, NumId, Department, UserId, Password, PwSalt, email, created) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
                        const result = await connection.query($query, [name, numId, dept, userId, derivedKey, salt, email])
                        connection.release()
                        return Promise.resolve()
                    } catch (err) {
                        console.log(err)
                        return Promise.reject({
                            code:'database_error',
                            message:'Database error'
                        })
                    }
                } catch (err) {
                    console.log(err)
                    return Promise.reject({
                        code:'database_error',
                        message:'Database error'
                    })
                }
            }
            doCreate()
        })
    }

    UserCheck()
    .then(Create)
    .then(() => {
        console.log(name, numId, dept, userId, pw, email)

        res.send("Success")
        res.end()
    })
    .catch((err) => {
        console.log(err)

        res.send(err.code)
        res.end()
    })
}