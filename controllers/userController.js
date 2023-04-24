const User = require("../models/User");
const passwordService = require('../services/passwordService');
const { login } = require('../services/passwordService');
const jwt = require("jsonwebtoken");
const emailSender = require("../services/emailSender")
exports.RegisterGet = (req,res) => {
  res.render("User/Register",{
      layout: "layout",
      title : "Register"
  })
}
let today = new Date();
let memberDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

exports.Register = (req, res) => {
  const { nickname, ideology, password } = req.body;
  const hashedPassword = passwordService.hashPassword(password);
  const profilePicture = `/uploads/${req.file.filename}`;
  if (req.file) {
    const user = {
      Nickname: nickname,
      Email: nickname+"@ideologycall.fun",
      Ideology: ideology,
      Password: hashedPassword,
      MemberDate: memberDate,
      ProfilePicture:profilePicture
    };

    User.create(user)
    .then((user) => {
      console.log(user);
      
      res.redirect("/user/login");
    })
    .catch((err) => {
      console.log(err);
    });
  }else {
    res.send("Please Select Correct Profile Picture Format")
  }
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
  const profilePicture = `/uploads/${req.file.filename}`;
  const userId = decodedToken.userId;
  const user = await User.getUserById(userId);
  User.update(userId,req.body.Email,req.body.Nickname,passwordService.hashPassword(req.body.Password),profilePicture)
  .then((result)=> {console.log(result); res.redirect("/user/profile")})
  .catch(err => {console.log(err);})
}
exports.logout = (req, res) => {
  // session ve jwt tokeni ile ilgili işlemleri burada yapabilirsiniz
  // örneğin:
  res.clearCookie("jsonwebtoken"); // jwt tokenini sil
  res.redirect("/user/login"); // login sayfasına yönlendir
}

exports.pending = (req,res)=> {
  res.render("User/pending",{
    layout : "layout",
    title : "YOU ARE PENDING"
  })
}
exports.authenticateMailToken = async(req,res)=> {
  try {
    const user = await User.getUserById({_id:req.params.id});
    if (!user) {
      return res.status(400).send("Invalid link");

    }
    const token = process.env.VERIFICATION_TOKEN;
    if (!req.params.token == token) {
      return res.status(400).send("Invalid Link");
    }
    await User.update({_id:user._id,IsBanned:false})
    res.redirect("/user/login")
  } catch (error) {
    
  }
}
const createToken = (userId)=>{
  return jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"1d",
  })
};