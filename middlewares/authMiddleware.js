const User = require("../models/User")
const jwt = require("jsonwebtoken")
const AuthenticateToken = async (req,res,next)=>{
    const authHeader = req.headers["authorization"]
    
    try {
        const token = req.cookies.jsonwebtoken;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.getUserById(decodedToken.userId);
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
const checkUser = async (req, res, next) => {
    const token = req.cookies.jsonwebtoken;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.locals.user = null;
          next();
        } else {
          const user = await User.getUserById(decodedToken["userId"]);
          res.locals.user = user; // ilk kullanıcıyı alın
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
};

const IsHeBanned = (req,res,next)=> {
  const token = req.cookies.jsonwebtoken;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      res.locals.user = null;
      next();
    } else {
      const user = await User.getUserById(decodedToken["userId"]);
      if (user.IsBanned) {
        res.send("YOU APPEAR TO BE BANNED ON OUR SYSTEMS, IF YOU HAVE NOT VERIFIED EMAIL, VERIFY WITH THE LINK SENT TO YOUR EMAIL BOX")
      }
      else {
        next();
      }
    }
  });
}
module.exports= {AuthenticateToken,checkUser,IsHeBanned}