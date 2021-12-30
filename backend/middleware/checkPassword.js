const passwordSchema = require('../models/Password')

module.exports = (req, res, next) => {
    const isValidPassword = (password) => {
    
        if (passwordSchema.validate(password)) {
            next();
        } else {
            res.status(400).json({
                message: "Format de mot de passe invalide !"
              });
        }
    };
    isValidPassword(req.body.password);
}