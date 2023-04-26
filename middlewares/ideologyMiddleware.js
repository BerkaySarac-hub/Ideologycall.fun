const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkIdeology = async (req, res, next) => {
  const allowedIdeologies = "marksism";
  const requestedIdeology = "marksism";

  if (!allowedIdeologies.includes(requestedIdeology)) {
    return res.status(403).send('Bu sayfaya erişim izniniz yok.');
  }

  next();
};

module.exports = {
  checkIdeology,
}