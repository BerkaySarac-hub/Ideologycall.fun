const User = require("../models/User")
const jwt = require("jsonwebtoken")
const AuthenticateToken = async (req,res,next)=>{
    const authHeader = req.headers["authorization"]
    
    const token = req.cookies.jsonwebtoken;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.getById(decodedToken.userId);
    if(token) {
        jwt.verify(token,process.env.JWT_SECRET,(err)=>{
            if(err){
                console.log(err.message);
                res.redirect("/user/login");
            }else {
                req.user = user;
                next();
            }
        })
    }else {
        res.redirect("/user/login")
    }
}

module.exports= {AuthenticateToken}