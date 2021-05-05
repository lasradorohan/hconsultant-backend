const express = require('express')
const router = express.Router()

const consult = require('../controllers/consultation')
const isAuth = require('../middleware/isAuth')
const isDoctor = require('../middleware/isDoctor')
const isPatient = require('../middleware/isPatient')

// patient routes
router.use(isAuth)
router.get('/patient', isPatient, consult.validate.getPatient, consult.getPatient)
router.post('/patient', isPatient, consult.validate.requestPatient, consult.requestPatient)
router.patch('/patient', isPatient, consult.validate.confirmPatient, consult.confirmPatient)

// doctor routes
router.get('/doctor', isDoctor, consult.validate.getDoctor, consult.getDoctor)
router.post('/doctor', isDoctor, consult.validate.reviewDoctor, consult.reviewDoctor)
router.patch('/doctor', isDoctor, consult.validate.prescribeDoctor, consult.prescribeDoctor)

module.exports = router