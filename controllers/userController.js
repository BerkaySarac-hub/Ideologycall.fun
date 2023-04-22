const User = require("../models/User");
const passwordService = require('../services/passwordService');
const { login } = require('../services/passwordService');
const jwt = require("jsonwebtoken");

exports.RegisterGet = (req,res) => {
  res.render("User/Register",{
      layout: "layout",
      title : "Register"
  })
}
let today = new Date();
let memberDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

exports.Register = (req, res) => {
  const { nickname, email, ideology, password } = req.body;
  const hashedPassword = passwordService.hashPassword(password);
    const user = {
      Nickname: nickname,
      Email: email,
      Ideology: ideology,
      Password: hashedPassword,
      MemberDate: memberDate,
    };
    User.create(user)
    .then((user) => {
      console.log(user);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.loginGet = (req,res)=> {
  res.render("User/login",{
    layout:"layout",
    title:"LOGİN"
  })
}


exports.login = async (req,res)=>{
  
  const nickname = req.body.Nickname;
  const email = req.body.Email;
  const password = req.body.Password;
  const userId = await User.getUserIdByEmail(email);
  
  const token = createToken(userId);
  res.cookie("jsonwebtoken",token,{
    httpOnly:true,
    maxAge:1000*60*24,
  })
  try {
    const user = await User.getUserByEmail(email);
    const UserIdeology = await User.getIdeologyByEmail(email);
    const userPass = await User.getPasswordByEmail(email);
    const userNickname = await User.getNicknameByEmail(email);
    if(user !==null) {
      console.log(password ,userPass);
      let passwordResult = passwordService.comparePassword(password,userPass);
      console.log("NİCKNAME ======= " +nickname + userNickname);
      if (passwordResult && nickname == userNickname) {
        console.log(UserIdeology + "WE ARE İN THE İF")
        res.locals.loggetIn = true;
        res.redirect(`/${UserIdeology}/home`);
      } else {
        res.locals.loggetIn = false;
        return;
      }
    }
  } catch (err) {
    console.log("err if çalıştı", err);
    throw err;
    }
}

exports.index = (req,res)=>{
  res.render("User/index",{
    layout:"layout",
    title : "Index"
  })
}

exports.profileGet = async (req,res) => {
  const token = req.cookies.jsonwebtoken;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const userId = decodedToken.userId;
  const user = await User.getUserById(userId);
  res.render("User/profile",{
    layout:"layout",
    title:"Profile",
    user : user
  })
}
exports.profilePost = async (req,res) => {
  const token = req.cookies.jsonwebtoken;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const userId = decodedToken.userId;
  const user = await User.getUserById(userId);
  User.update(userId,req.body.Email,req.body.Nickname,passwordService.hashPassword(req.body.Password)).then((result)=> {console.log(result); res.redirect("/user/profile")}).catch(err => {console.log(err);})
}
exports.logout = (req, res) => {
  // session ve jwt tokeni ile ilgili işlemleri burada yapabilirsiniz
  // örneğin:
  res.clearCookie("jsonwebtoken"); // jwt tokenini sil
  res.redirect("/user/login"); // login sayfasına yönlendir
}

const createToken = (userId)=>{
  return jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"1d",
  })
};