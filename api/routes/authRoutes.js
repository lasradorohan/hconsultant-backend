const express  = require('express');
const router = express.Router();

//import controllers
const authControllers = require('../controllers/authControllers')

//patient routes
router.post('/patient/register', authControllers.patientRegister)
router.post('/patient/login', authControllers.patientLogin)

//doctor routes
router.post('/doctor/register', authControllers.doctorRegister)
router.post('/doctor/login', authControllers.doctorLogin)

module.exports = router