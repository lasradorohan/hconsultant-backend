
const db = require('../models/mySqlConnection')
const { body, validationResult} = require('express-validator')

module.exports = {
    getDoctors: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        db.query('SELECT email, name, area FROM doctor', (queryError, queryResult) => {
            if(queryError){
                console.log(queryError)
                return res.status(404).json({message: "not found"})
            }
            if(queryResult){
                console.log(`querried doctors: ${JSON.stringify(queryResult)}`)
                return res.status(200).json({message: "successful", array: queryResult})
            }
        })
    },

    validate: {
        getDoctors: [],
    }
}