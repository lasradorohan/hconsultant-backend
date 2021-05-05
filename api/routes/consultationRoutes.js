const express = require('express')
const router = express.Router()

const consultation = require('../controllers/consultation')
const isAuth = require('../middleware/isAuth')
const isDoctor = require('../middleware/isDoctor')
const isPatient = require('../middleware/isPatient')

// patient routes
router.use(isAuth)
router.get('/patient', isPatient, consultation.validate('getPatientConsultation'), consultation.getPatientConsultation)
router.post('/patient', isPatient, consultation.validate('requestPatientConsultation'), consultation.requestPatientConsultation)
router.patch('/patient', isPatient, consultation.validate('confirmPatientConsultation'), consultation.confirmPatientConsultation)

// doctor routes
router.get('/doctor', isDoctor, consultation.validate('getDoctorConsultation'), consultation.getDoctorConsultation)
router.patch('/doctor', isDoctor, consultation.validate('reviewDoctorConsultation'), consultation.reviewDoctorConsultation)

module.exports = router