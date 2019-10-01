const pool = require("./pool")
require('dotenv').config();

const one = async () => {
    try {
        const connection = await pool.getConnection(async conn => conn)
        try {
            const [rows] = await connection.query("SELECT * FROM practice")

            return Promise.resolve(rows)
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}

one()
.then(rows => {
    console.log(rows.length)
    console.log(rows[0])
})