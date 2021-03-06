const pool = require("../pool")
require("dotenv").config()

const admin = require("firebase-admin")
const serviceAccount = require("../push-practice-99593-firebase-adminsdk-lx6a1-a33d380477.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //databaseURL: "https://push-practice-99593.firebaseio.com"
})

exports.SendPush = (req, res) => {
    console.log("Post sendPush");

    const pushTitle = req.body.pushTitle
    const pushBody = req.body.pushBody
    const senderToken = req.body.senderToken

    const MembersDBRef = async () => {
        try {
            const connection = await pool.getConnection(async conn => conn)
            try {
                const [rows] = await connection.query("SELECT Name FROM token where Token=?", [senderToken])
                connection.release()

                const senderName = rows[0].Name

                return Promise.resolve(senderName)
            } catch (err) {
                console.log(err)
                return Promise.reject()
            }
        } catch (err) {
            console.log(err)
            return Promise.reject()
        }
    }

    const TokenDBRef = async (senderName) => {
        try {
            const connection = await pool.getConnection(async conn => conn)
            try {
                const [rows] = await connection.query("SELECT * FROM token")

                const payload = {
                    rows: rows,
                    senderName: senderName
                }

                return Promise.resolve(payload)
            } catch (err) {
                console.log(err)
                return Promise.reject()
            }
        } catch (err) {
            console.log(err)
            return Promise.reject()
        }
    }

    const SendProcess = (payload) => {
        const rows = payload.rows
        const senderName = payload.senderName
        
        len = rows.length

        try {
            for (i = 0; i < len; i++) {
                const fcm_target_token = rows[i].Token
                const fcm_message = {
                    data: {     
                        title: pushTitle,
                        message: pushBody,
                        senderName: senderName,
                    }, 
                    notification: {
                        title: pushTitle,
                        body: pushBody,
                    },
                    android: {
                        notification: {
                            click_action:"OPEN_MSG_ACTIVITY",
                            color:"#5BC2E7",
                            icon:"ic_launcher"
                        },
                        priority:"high"
                    },
                    token: fcm_target_token
                }
    
                admin.messaging().send(fcm_message)
                .then(response => {
                    console.log(`보내기 성공\n\tFrom : ${senderToken}\n\tTo : ${fcm_target_token}`)
                })
                .catch(err => {
                    console.log("보내기 실패, 메시지 : " + err)
                    console.log("\tFrom : " + ",\n\tTo : " + fcm_target_token)
                })
            }

            return Promise.resolve()
        } catch (err) {
            console.log(err)
            return Promise.reject()
        }
    }

    const sendRes = () => {
        try {
            res.send("Success")
            res.end()

            return Promise.resolve()
        } catch (err) {
            console.log(err)
            return Promise.reject()
        }
    }

    MembersDBRef()
    .then(TokenDBRef)
    .then(SendProcess)
    .then(sendRes)
    .catch()
}