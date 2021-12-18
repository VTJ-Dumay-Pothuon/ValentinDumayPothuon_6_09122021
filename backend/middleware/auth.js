const jwt = require('jsonwebtoken');

require("dotenv").config();

/* Check if the json web token transmitted by the user is a properly formatted token, 
   AND was indeed encrypted using the website's secret key.*/
 module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,
    `${process.env.TOKEN_1}`+
    `${process.env.TOKEN_2}`+
    `${process.env.TOKEN_3}`+
    `${process.env.TOKEN_4}`,);
    const userId = decodedToken.userId;
    req.auth = { userId };  
    if (req.body.userId && req.body.userId !== userId) {
      throw 'ID utilisateur invalide !';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Utilisateur non autorisé !')
    });
  }
};