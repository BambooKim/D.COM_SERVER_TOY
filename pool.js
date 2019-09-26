const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
})

module.exports = pool