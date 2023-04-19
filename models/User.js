const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'ideologycall',
  port:3306
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

const User = {
  create: (user, callback) => {
    connection.query('INSERT INTO user SET ?', user, (err, result) => {
      if (err) {
        console.log(err.message);
        return callback(err);
      }
      
      callback(null, result);
    });
  },


  getAll: (callback) => {
    connection.query('SELECT * FROM user', (err, rows) => {
      if (err) throw err;
      callback(rows);
    });
  },

  getById: (id, callback) => {
    connection.query(`SELECT * FROM user WHERE id = ('${id}')`, (err, rows) => {
      if (err) throw err;
      return(rows[0]);
    });
  },
  findOne : (Email) => {
    connection.query(`SELECT * FROM user WHERE Email = ('${Email}')`,(err,rows)=>{
      if(err) throw err;
      console.log("there is an data :" , rows[0])
      return(rows[0]);
    })
},
getUserIdeology : (Email) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT Ideology FROM user WHERE Email = ('${Email}')`,(err,rows)=>{
      if(err) return reject(err);
      resolve(rows[0].Ideology);
    });
  });
},
getUserId :(email)=>{
  connection.query(`SELECT Id FROM user where Email = ('${email}')`,(err,rows)=>{
    if(err) throw err;
    console.log("ID =" + rows[0].Id)
    return(rows[0]);
  })
},
  update: (id, user, callback) => {
    connection.query('UPDATE users SET ? WHERE id = ?', [user, id], (err, result) => {
      if (err) throw err;
      callback(result);
    });
  },

  delete: (id, callback) => {
    connection.query('DELETE FROM users WHERE id = ?', id, (err, result) => {
      if (err) throw err;
      callback(result);
    });
  }
};

module.exports = User;