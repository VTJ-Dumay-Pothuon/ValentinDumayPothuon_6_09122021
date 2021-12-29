module.exports = (req, res, next) => {
    const isValidInput = (sauce) => {
        const regexp = new RegExp ( "^[^\\[\\]\\|\\;]+$" );
        if ( regexp.test(String(sauce.name)) &&
             regexp.test(String(sauce.manufacturer)) && 
             regexp.test(String(sauce.description)) &&
             regexp.test(String(sauce.mainPepper)) ) {
            next();
        } else {
            res.status(403).json({
                message: "Un ou plusieurs champs contient un caractère invalide !"
              });
        }
    };
    isValidInput(req.body);
}