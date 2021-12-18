const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require("dotenv").config();

// Add the user mail and hashed password into the database
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


/* Check if the user email is in the database. Then, if the mail is found,
   encrypt the password, and check if the encrypted password in the database
   was encrypted from the same string. If yes, then generates a temporary json web token,
   itself encrypted with a 256 characters long hexadecimal key made of four SHA256 Hashes.*/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
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