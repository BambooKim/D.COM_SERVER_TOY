const pool = require("../pool")
const crypto = require("crypto")

exports.Login = (req, res) => {
    console.log('who get in here post /login')

    const user_id = req.body.user_id
    const user_pw = req.body.user_pw
    const token = req.body.token

    const UserCheck = async () => {
        try {
            const connection = await pool.getConnection(async conn => conn)
            connection.release()
            try {
                const [rows] = await connection.query("SELECT * FROM members WHERE UserId = ?", [user_id])
                if (!rows[0]) {
                    return Promise.reject({
                        code: "no_user",
                        message: "Cannot find user"
                    })
                }
                return Promise.resolve(rows)
            } catch (err) {
                console.error(err)
                return Promise.reject({
                    code: "no_user",
                    message: "Cannot find user"
                })
            }
        } catch (err) {
            return Promise.reject({
                code:'database_connection_error',
                message:'Failed to connect database'
            })
        }
    }
    
    const PWCheck = (rows) => {
        let user = rows[0]

        return new Promise((resolve, reject) => {
            try {
                crypto.pbkdf2(user_pw, user.PwSalt, Number(process.env.CRYPTO_ITERATION), 64, "sha512", (err, derivedKey) => {
                    if (err) throw err

                    if (derivedKey.toString("base64") === user.Password) {
                        console.log("Password Matches")
                        resolve(user)
                    } else {
                        console.log("Password MisMatches")
                        reject({
                            code:'password_error',
                            message:'Password is wrong',
                        })
                    }
                })
            } catch (err) {
                console.log(err)
            
                reject(err)
            }
        })
    }

    const TokenProcess = async (user) => {
        let name = user.Name
        if (token !== "") {
            console.log(name + ", " + user_id + " : " + token)
            try {
                const connection = await pool.getConnection(async conn => conn)
                try {
                    const result = await connection.query("INSERT INTO token (Name, UserId, Token) VALUES (?, ?, ?)", [name, user_id, token])
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
        } else {
            return Promise.resolve()
        }
    }

    setTimeout(() => {
        UserCheck()
        .then(PWCheck)
        .then(TokenProcess)
        .then(() => {
            console.log("Login Success")
            res.send("Login Success")
            res.end()
        })
        .catch(err => {
            console.log(err)
            res.send("Login Fail")
            res.end()
        })
    }, 1000)
}