module.exports = (req, res, next) => {
    const isValidEmail = (email) => {
        const regexp = new RegExp ( "^[0-9A-Za-zÀ-ÖØ-öø-ſ\\+\\-\\.\\_]+@[0-9a-z\\-]+\\.[a-z]+$" );
        if (regexp.test(String(email).toLowerCase())) {
            next();
        } else {
            res.status(400).json({
                error: new Error("Format d'email invalide !")
              });
        }
    };
    isValidEmail(req.body.email);
};