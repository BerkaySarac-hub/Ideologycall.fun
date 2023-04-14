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
      Nickname: nickname,
      Email: email,
      Ideology: ideology,
      Password: hashedPassword,
      ProfilePicture: profilePicture,
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
  const {nickname,email,password} = req.body;
  try {
    const user = await login(email, password);
    if (user) {
      req.session.user = user;
      res.status(200).json({
        user,
        token:createToken(user.Id)
      })
      res.redirect('/');
    } else {
      res.render('User/login', { message: 'Invalid credentials',title:"login" });
    }
  } catch (err) {
    console.error(err);
    res.render('User/login', { message: 'An error occurred',title:"login" });
  }
}

const createToken = (userId)=>{
  return jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"1d",
  })
};