module.exports = (req,resp,next)=>{
    if(req.userData && req.userData.usertype === 'patient'){
        next();
    } else {
        res.status(401).json({message: "unauthenticated"})
    }
}