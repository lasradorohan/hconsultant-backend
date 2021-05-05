module.exports = (req,resp,next)=>{
    if(req.userData && req.userData.usertype === 'doctor'){
        next();
    } else {
        res.status(401).json({message: "unauthenticated"})
    }
}