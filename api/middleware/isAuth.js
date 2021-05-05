const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        // console.log(`received auth header: ${JSON.stringify(req.headers.authorization)}`)
        const token = req.headers.authorization.split(" ")[1]
        // console.log(typeof (req.headers.authorization))
        // console.log(`received token ${token}`)
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decoded
        console.log(`received token: ${JSON.stringify(decoded)}`)
        // console.log(`token belongs to: ${JSON.stringify(req.userData)}`)
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ "message": "auth failed" })
    }


}