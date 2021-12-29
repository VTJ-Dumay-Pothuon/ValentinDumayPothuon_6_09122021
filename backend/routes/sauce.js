const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');
const inputCtrl = require('../middleware/checkInput');

router.post('/', auth, inputCtrl, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getSauce);
router.put('/:id', auth, inputCtrl, multer, sauceCtrl.editSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce)

module.exports = router;