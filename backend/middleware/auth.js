import { verify } from 'jsonwebtoken';

/* Check if the json web token transmitted by the user is a properly formatted token, 
   AND was indeed encrypted using the website's secret key.*/
export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verify(token,
    '80054dbedac23ababe41db5757efb94efaf2ea5cd79b94279b8bfb485e27b36c'+
    'b18520d7910403c19981f951b864e23eb898f077c410fc62a72744a5a0df584f'+
    'fd8a25d903c598b450da78217f97c670066f666130ef38f0ffe612b60bd619eb'+
    '95c7b42f7b384f028efef0f3e8e15d1a1632cbd0c76ca271772675a9f8efa86f',);
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