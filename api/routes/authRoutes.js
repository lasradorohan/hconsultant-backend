const express  = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

//import controllers
const auth = require('../controllers/auth')

//patient auth
router.post('/patient/register', auth.patientRegister, auth.patientRegister)
router.post('/patient/login', auth.patientLogin, auth.patientLogin)

//doctor auth
router.post('/doctor/register', auth.doctorRegister, auth.doctorRegister)
router.post('/doctor/login', auth.doctorLogin, auth.doctorLogin)

router.post('/checkAuth', (req, res)=>{
    try {
        const token = req.body.token
        console.log(`received token: ${token}`)
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        console.log(`decoded: ${JSON.stringify(decoded)}`)
        res.status(200).json({message: "successful"})
    } catch (error) {
        console.log(`received invalid/no token: ${error}`)
        return res.status(200).json({ message: "unsuccessful" })
    }
})


module.exports = router