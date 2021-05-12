const db = require('../models/mySqlConnection')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

module.exports = {
    patientRegister: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        db.query("SELECT * FROM patient where ? LIMIT 1", { email: req.body.email }, (error, result) => {
            if (error) {
                console.log(error)
            } else if (result.length >= 1) {
                res.status(400).json({ message: "account already exists" })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json("internal server error")
                    }
                    if (hash) {
                        let newPatient = {
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            age: req.body.age,
                            gender: req.body.gender,
                        }
                        if ('weight' in req.body) {
                            newPatient.weight = req.body.weight
                        }
                        if ('blood_group' in req.body) {
                            newPatient.blood_group = req.body.blood_group
                        }
                        db.query("INSERT INTO patient SET ?", [newPatient], (error, result) => {

                            console.log(`query result: ${JSON.stringify({ error: error, result: result })}`)
                            if (error) {
                                res.status(400).json({ message: "unsuccessful" })
                            } else {
                                console.log(`created patient ${JSON.stringify(newPatient)}`)
                                res.status(201).json({ message: "successful" })
                            }
                        })
                    }
                })
            }
        })



    },
    patientLogin: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        db.query("SELECT * FROM patient where ? LIMIT 1", { email: req.body.email }, (queryError, queryResult) => {
            if (queryError) {
                console.log(queryError)
            } else if (queryResult.length < 1) {
                res.status(401).json({ message: "auth failed", data: "" })
            } else {
                console.log(`found patient: ${queryResult[0]}`)
                bcrypt.compare(req.body.password, queryResult[0].password, (compareError, compareResult) => {
                    if (compareError) {
                        console.log(compareError)
                        res.status(401).json({ message: "auth failed", data: "" })
                    }
                    if (compareResult) {
                        const token = jwt.sign({
                            email: req.body.email,
                            name: req.body.name,
                            user_type: 'patient'
                        }, process.env.JWT_KEY, {
                            expiresIn: "3h"
                        })
                        console.log(`created token: ${JSON.stringify(token)}`)
                        res.status(200).json({
                            message: "sucessful",
                            data: token
                        })
                    }
                })
            }
        })
    },
    doctorRegister: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        db.query("SELECT * FROM doctor where ? LIMIT 1", { email: req.body.email }, (error, result) => {
            if (error) {
                console.log(error)
            } else if (result.length >= 1) {
                res.status(400).json({ message: "account already exists" })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json("internal server error")
                    }
                    if (hash) {
                        let newDoctor = {
                            email: req.body.email,
                            password: hash,
                            name: req.body.name
                        }
                        if ('age' in req.body) {
                            newDoctor.age = req.body.age
                        }
                        if ('gender' in req.body) {
                            newDoctor.gender = req.body.gender
                        }
                        if ('bio' in req.body) {
                            newDoctor.bio = req.body.bio
                        }
                        db.query("INSERT INTO doctor SET ?", [newDoctor], (error, result) => {
                            console.log(`query result: ${JSON.stringify({ error: error, result: result })}`)
                            if (error) {
                                res.status(400).json({ message: "unsuccessful" })
                            } else {
                                console.log(`created doctor ${JSON.stringify(newDoctor)}`)
                                res.status(201).json({ message: "successful" })
                            }
                        })
                    }
                })
            }
        })
    },
    doctorLogin: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        db.query("SELECT * FROM doctor where ? LIMIT 1", { email: req.body.email }, (queryError, queryResult) => {
            if (queryError) {
                res.status(404).json({ message: "" })
            } else if (queryResult.length < 1) {
                res.status(401).json({ message: "auth failed" })
            } else {
                console.log(`found doctor: ${queryResult[0]}`)
                bcrypt.compare(req.body.password, queryResult[0].password, (compareError, compareResult) => {
                    if (compareError) {
                        console.log(compareError)
                        return res.status(401).json({ message: "auth failed" })
                    }
                    if (compareResult) {
                        const token = jwt.sign({
                            email: req.body.email,
                            name: req.body.name,
                            user_type: 'doctor'
                        }, process.env.JWT_KEY, {
                            expiresIn: "3h"
                        })
                        console.log(`created token: ${JSON.stringify(token)}`)
                        res.status(200).json({
                            message: "sucessful",
                            data: token
                        })
                    }
                })
            }
        })
    },

    validate: {
        patientRegister: [
            body('email', 'email invalid/empty').exists().isEmail(),
            body('password', 'password required').exists(),
            body('name', 'name required').exists(),
            body('age', 'age required').exists().isInt(),
            body('gender', 'gender required').exists().isIn(['M', 'F', 'O', 'U']),
            body('weight').optional(),
            body('blood_group').optional().isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
        ],
        patientLogin: [
            body('email', 'field email is invalid/empty').exists().isEmail(),
            body('password', 'password required').exists()
        ],
        doctorRegister: [
            body('email', 'field email is invalid/empty').exists().isEmail(),
            body('password', 'password required').exists(),
            body('name', 'name required').exists(),
            body('age').optional().isInt(),
            body('gender').optional(),
            body('bio').optional()
        ],
        doctorLogin: [
            body('email', 'email invalid/empty').exists().isEmail(),
            body('password', 'password required').exists()
        ]
    }
}