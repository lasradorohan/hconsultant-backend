const db = require('../models/mySqlConnection')
const { body, validationResult, Result } = require('express-validator')

module.exports = {
    getPatientConsultation: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        db.query("SELECT * FROM consultation WHERE ?", { patientEmail: req.userData.email }, (queryError, queryResult) => {
            if (queryError) {
                return res.status(404).json({ message: "not found try sigining in again" })
            }
            if (queryResult) {
                console.log(`querried consltations: ${JSON.stringify(queryResult)}`)
                res.status(200).json({message: "successful", consultations: queryResult})
            }
        })
    },
    requestPatientConsultation: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        db.query("INSERT INTO consultation SET ?", {
            patientEmail: req.userData.email,
            doctorEmail: req.body.doctorEmail,
            requestedTimeBegin: req.body.requestedTimeBegin,
            requestedTimeEnd: req.body.requestedTimeEnd 
        }, (queryError, queryResult) => {
            if(queryError){
                console.log(queryError)
                return res.status(500).json({message: "server error"})
            }
            if(queryResult){
                console.log(`added consultation request: ${JSON.stringify(queryResult)}`)
                return res.status(201).json({message: "successful", consultationID: queryResult.insertId})
            }
        })
    },
    confirmPatientConsultation: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        db.query("UPDATE consultation SET ? WHERE ?", [{
            status: req.body.status
        }, {
            consultationID: req.body.consultationID
        }], (queryError, queryResult) => {
            if(queryError){
                console.log(queryError)
                return res.status(404).json({message: "not found"})
            }
            if(queryResult){
                console.log(`query result: ${JSON.stringify(queryResult)}`)
                return res.status(200).json({message: "successful"})
            }
        })
    },

    getDoctorConsultation: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        db.query("SELECT * FROM consultation WHERE ?", { doctorEmail: req.userData.email }, (queryError, queryResult) => {
            if (queryError) {
                return res.status(404).json({ message: "not found try sigining in again" })
            }
            if (queryResult) {
                console.log(`querried consltations: ${JSON.stringify(queryResult)}`)
                res.status(200).json({message: "successful", consultations: queryResult})
            }
        })
    },
    reviewDoctorConsultation: (req, res) => {
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        if(req.body.status == 'approve'){
            db.query("UPDATE consultation SET ? WHERE ?", [{
                status: 'approve',
                scheduledTimeBegin: req.body.scheduledTimeBegin,
                scheduledTimeEnd: req.body.scheduledTimeEnd    
            }, {
                consultationID: req.body.consultationID
            }], (queryError, queryResult) => {
                if (queryError) {
                   return res.status(500).json({ message: "internal server error" })
                }
                if (queryResult) {
                    console.log(`query result: ${JSON.stringify(queryResult)}`)
                    res.status(200).json({message: "successful"})
                }
            })
        } else if(req.body.status == 'cancel'){
            db.query("UPDATE consultation SET ? WHERE ?", {
                status: 'cancel' 
            }, {
                consultationID: req.body.consultationID
            }, (queryError, queryResult) => {
                if (queryError) {
                   return res.status(500).json({ message: "internal server error" })
                }
                if (queryResult) {
                    console.log(`query result: ${JSON.stringify(queryResult)}`)
                    res.status(200).json({message: "successful"})
                }
            })

        }
       
    },

    validate: method => {
        
        switch (method) {
            case 'getPatientConsultation': return []
            case 'requestPatientConsultation': return [
                body('doctorEmail', 'doctorEmail invalid/empty').exists().isEmail(),
                body('requestedTimeBegin', 'requested start of period is required').exists(),
                body('requestedTimeEnd', 'requested end of period is requried').exists()
            ]
            case 'confirmPatientConsultation': return [
                body('consultationID', 'consultationID required').exists(),
                body('status', 'status request invalid/empty').exists().isIn(['confirm', 'cancel'])
            ]
            case 'getDoctorConsultation': return []
            case 'reviewDoctorConsultation': return [
                body('consultationID', 'consultationID required').exists(),
                body('status', 'status request invalid/empty')
                    .exists()
                    .isIn(['approve', 'cancel'])
                    .custom((status, {req}) => 
                        status != 'approve' ||
                            (('scheduledTimeBegin' in req.body) && ('scheduledTimeEnd' in req.body))
                    )
            ]
        }
    }
}