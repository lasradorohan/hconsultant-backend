const express  = require('express');
const router = express.Router();

//import controllers
const authControllers = require('../controllers/authControllers')

//patient routes
router.post('/patient/register', authControllers.validate('patientRegister'), authControllers.patientRegister)
router.post('/patient/login', authControllers.validate('patientLogin'), authControllers.patientLogin)

//doctor routes
router.post('/doctor/register', authControllers.validate('doctorRegister'), authControllers.doctorRegister)
router.post('/doctor/login', authControllers.validate('doctorLogin'), authControllers.doctorLogin)

module.exports = router