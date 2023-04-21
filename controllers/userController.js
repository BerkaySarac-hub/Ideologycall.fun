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
  if (req.file) {
    const profilePicture = `/uploads/${req.file.filename}`; // Burada, "/" yolunun sunucunun kök dizinine karşılık geldiğine dikkat edin
    const user = {
      Nickname : nickname,
      Email : email,
      Ideology : ideology,
      Password : hashedPassword,
      ProfilePicture : profilePicture,
      MemberDate : memberDate
    };
    User.create(user,  (err, result) =>{
      if (err) {
        console.log(err);
        res.send("Bir hata oluştu");
      } else {
        console.log(result);
        res.redirect("/");
      }
    });
  } else {JSON
};
}
exports.loginGet = (req,res)=> {
  res.render("User/login",{
    layout:"layout",
    title:"LOGİN"
  })
}


exports.login = async (req,res)=>{
  console.log("login post çalıştı")
  const nickname = req.body.nickname;
  const email = req.body.Email;
  const password = req.body.Password;
  const userId = User.getUserByEmail(email);
  console.log(userId + " USER Id ***************************")
  const token = createToken(userId);
  res.cookie("jsonwebtoken",token,{
    httpOnly:true,
    maxAge:1000*10,
  })
  try {
    const user = await User.getUserByEmail(email);
    const UserIdeology = await User.getIdeologyByEmail(email);
    
  
    if(user !==null) {
      console.log("user bulundu çalıştı")
      let passwordResult =passwordService.comparePassword
      if (passwordResult) {
        console.log(UserIdeology)
        
        res.redirect(`/${UserIdeology}/home`);
      } else {
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
  const userId = req.cookie.userId;
  const user = await User.getUserById(userId);
  res.render("/User/profile",{
    layout:"layout",
    title:"Profile",
    user : user
  })
}

const createToken = (userId)=>{
  return jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"1d",
  })
};