module.exports = (req, res, next) => {
    if (req.userData && req.userData.user_type === 'patient') {
        next();
    } else {
        res.status(401).json({message: "unauthenticated"})
    }
}