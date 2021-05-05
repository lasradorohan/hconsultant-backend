const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        console.log(`received token ${token}`)
        const decoded = jwt.decode(req.body.token, process.env.JWT_KEY)
        req.userData = decoded
        next()
    } catch (error) {
        return res.status(401).json({ "message": "auth failed" })
    }


}