const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CryptoJS = require("crypto-js");

require("dotenv").config();

// Add the user encrypted mail and hashed password into the database
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: CryptoJS.EvpKDF(req.body.email, process.env.CRYPTOMAIL).toString(CryptoJS.enc.Base64),
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(403).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


/* The mail is two-ways encrypted. It can still be decrypted to mail the user ;
   The password is one-way hashed. It can only be compared to a hashed string ;
   The JSON web token is signed by four nonsensical SHA256 hashes (256 chars) */
exports.login = (req, res, next) => {
    const emailCrypt  = CryptoJS.EvpKDF(req.body.email, process.env.CRYPT).toString(CryptoJS.enc.Base64);
    User.findOne({ email: emailCrypt })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                `${process.env.TOKEN_1}`+
                `${process.env.TOKEN_2}`+
                `${process.env.TOKEN_3}`+
                `${process.env.TOKEN_4}`,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };