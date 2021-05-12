const express  = require('express');
const app = require('../../app');
const router = express.Router();

//import controllers
const misc = require('../controllers/misc');
const isAuth = require('../middleware/isAuth');
const isPatient = require('../middleware/isPatient');

//patient auth
router.use(isAuth)
router.get('/get_doctors', isPatient, misc.validate.getDoctors, misc.getDoctors)

module.exports = router