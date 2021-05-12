const express  = require('express');
const router = express.Router();

//import controllers
const auth = require('../controllers/auth')

//patient auth
router.post('/patient/register', auth.patientRegister, auth.patientRegister)
router.post('/patient/login', auth.patientLogin, auth.patientLogin)

//doctor auth
router.post('/doctor/register', auth.doctorRegister, auth.doctorRegister)
router.post('/doctor/login', auth.doctorLogin, auth.doctorLogin)

module.exports = router