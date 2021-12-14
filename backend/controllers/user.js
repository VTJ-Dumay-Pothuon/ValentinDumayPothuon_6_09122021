const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
                '80054dbedac23ababe41db5757efb94efaf2ea5cd79b94279b8bfb485e27b36c'+
                'b18520d7910403c19981f951b864e23eb898f077c410fc62a72744a5a0df584f'+
                'fd8a25d903c598b450da78217f97c670066f666130ef38f0ffe612b60bd619eb'+
                '95c7b42f7b384f028efef0f3e8e15d1a1632cbd0c76ca271772675a9f8efa86f',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };