const passwordValidator = require('password-validator');

module.exports = (req, res, next) => {
    const isValidPassword = (password) => {
        // Create a schema
        let schema = new passwordValidator();
        // Add properties to it
        schema
            .is().min(8)                  // Minimum length 8
            .is().max(100)                // Maximum length 100
            .has().uppercase()            // Must have uppercase letters
            .has().lowercase()            // Must have lowercase letters
            .has().digits(1)              // Must have at least 1 digit
            .has().not().spaces()         // Should not have spaces

        if (schema.validate(password)) {
            next();
        } else {
            res.status(400).json({
                message: "Format de mot de passe invalide !"
              });
        }
    };
    isValidPassword(req.body.password);
}