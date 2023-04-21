const User = require("../models/User")
const jwt = require("jsonwebtoken")
const AuthenticateToken = async (req,res,next)=>{
    const authHeader = req.headers["authorization"]
    
    try {
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
    } catch (error) {
        console.log("THERE İS AN ERROR" + error)
        res.redirect("/user/login");
    }
    
}
const checkUser = async (req,res,next)=> {
    console.log("CHECK USER ÇALIŞTI")
    const token = req.cookies.jsonwebtoken;
    console.log("CHECK USER ÇALIŞTI token =" + token)
    if (token) {
        console.log("CHECK USER ÇALIŞTI token bulundu")
        jwt.verify(token,process.env.JWT_SECRET, async (err,decodedToken)=>{
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                const user = await User.getById(decodedToken['userId'])
                console.log("CHECK USER ÇALIŞTI user nesnesine token ıd verildi " + user)
                res.locals.user = user;
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
}
module.exports= {AuthenticateToken,checkUser}