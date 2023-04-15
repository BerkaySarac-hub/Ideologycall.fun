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

// exports.login = (req,res)=>{
//   console.log("login post çalıştı")
//   const nickname = req.body.nickname;
//   const email = req.body.email;
//   const password = req.body.password;

//   User.findOne(email,(err,user)=>{
//     console.log("findone  çalıştı")
//     if(err){
//       console.log("err if  çalıştı"); throw err
//     }
//     else if(user) {
//       console.log("user bulundu çalıştı")
//       let passwordResult =passwordService.comparePassword(password,user.Password);
//       if (passwordResult) {
//         console.log("şifre doğrulama çalıştı true")
//         console.log("GİRİŞ BAŞARILI");
        
//         res.redirect("/");
//       } else {
//         console.log("şifre doğrulama çalıştı false")
//         console.log("GİRİŞ BAŞARISIZ");
//         return;
//       }
//     }
//   })
// }
exports.login = (req,res)=>{
  console.log("login post çalıştı")
  const nickname = req.body.nickname;
  const email = req.body.Email;
  const password = req.body.Password;

  try {
    const user =  User.findOne(email);
    console.log("findone  çalıştı")
    if(user !==null) {
      console.log("user bulundu çalıştı")
      let passwordResult =passwordService.comparePassword
      if (passwordResult) {
        console.log("şifre doğrulama çalıştı true")
        console.log("GİRİŞ BAŞARILI");
        
        res.redirect("/");
      } else {
        console.log("şifre doğrulama çalıştı false")
        console.log("GİRİŞ BAŞARISIZ");
        return;
      }
    }
  } catch (err) {
    console.log("err if çalıştı", err);
    throw err;
    }
    }
    
    

const createToken = (userId)=>{
  return jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"1d",
  })
};