const User = require("../models/User")
const jwt = require("jsonwebtoken")
const AuthenticateToken = async (req,res,next)=>{
    const authHeader = req.headers["authorization"]
    
    const token = req.cookies.jsonwebtoken;

    if(token) {
        jwt.verify(token,process.env.JWT_SECRET,(err)=>{
            if(err){
                console.log(err.message);
                res.redirect("/user/login");
            }else {
                next();
            }
        })
    }else {
        res.redirect("/user/login")
    }
}

module.exports= {AuthenticateToken}