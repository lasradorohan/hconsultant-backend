
const db = require('../models/mySqlConnection')
const { body, validationResult} = require('express-validator')

module.exports = {
    getChats: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const senderType = req.userData.user_type
        const recepientType = senderType == 'patient' ? 'doctor' : 'patient'
        db.query(
            'SELECT DISTINCT ' + recepientType + 'Email AS email, name '
            +'FROM chat INNER JOIN ' + recepientType +' ON '+recepientType+'Email=email WHERE ?',
            {[senderType+'Email']: req.userData.email},
            (queryError, queryResult) => {
                if(queryError){
                    console.log(queryError)
                    return res.status(404).json({message: "not found"})
                }
                if(queryResult){
                    console.log(`querried chats: ${JSON.stringify(queryResult)}`)
                    return res.status(200).json({message: "successful", array: queryResult})
                }
            }
        )
    },
    getMessages: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // if(!req.body.count) req.body.count = 20;

        const senderType = req.userData.user_type
        const recepientType = senderType == 'patient' ? 'doctor' : 'patient'
        db.query("SELECT timestamp, sender, content FROM chat WHERE "+senderType+"Email = ? AND "+recepientType+"Email = ? ORDER BY timestamp DESC",
            [req.userData.email, req.params.email],
            (queryError, queryResult) => {
            if(queryError){
                console.log(queryError)
                return res.status(404).json({message: "not found"})
            }
            if(queryResult){
                console.log(`querried chats: ${JSON.stringify(queryResult)}`)
                return res.status(200).json({message: "successful", array: queryResult})
            }
        })
    },
    post: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const senderType = req.userData.user_type
        const recepientType = senderType == 'patient' ? 'doctor' : 'patient'
        db.query("INSERT INTO chat SET ?", {
            [senderType+'Email']: req.userData.email,
            [recepientType+'Email']: req.params.email,
            sender: senderType,
            content: req.body.content
        }, (queryError, queryResult) => {
            if(queryError){
                console.log(queryError)
                return res.status(400).json({message: "invalid request"})
            }
            if(queryResult){
                console.log(`query post result: ${JSON.stringify(queryResult)}`)
                return res.status(200).json({message: "successful"})
            }
        })
    },

    validate: {
        getChats: [],
        getMessages: [
            // body('email', 'recepient email required').exists(),
            // body('count').optional().isInt()
        ],
        post: [
            // body('email', 'recepient email required').exists().isEmail(),
            body('content', 'message content required').exists()
        ]
    }
}