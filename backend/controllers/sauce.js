const Sauce = require('../models/Sauce');
const fs = require('fs');

// CREATE
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'New sauce added!'}))
    .catch(error => res.status(400).json({ error }));
};


// READ
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };
  
exports.getSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};


// UPDATE
exports.editSauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce updated!'}))
    .catch(error => res.status(400).json({ error }));
};


// DELETE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce deleted!'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


// (DIS)LIKE
exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        case 1: // LIKE
            Sauce.updateOne({ _id: req.params.id }, {  
                $push : {usersLiked: req.body.userId},
                 $inc : {likes: 1}
            })
            .then(() => res.status(200).json({ message: 'Sauce liked!'}))
            .catch(error => res.status(404).json({ error }));
            break;

        case -1: // DISLIKE
            Sauce.updateOne({ _id: req.params.id }, {  
                $push : {usersDisliked: req.body.userId},
                 $inc : {dislikes: 1}
            })
            .then(() => res.status(200).json({ message: 'Sauce disliked!'}))
            .catch(error => res.status(404).json({ error }));
            break;

        case 0: // BACK TO DEFAULT STATE
            Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {  
                        $pull : {usersLiked: req.body.userId},
                         $inc : {likes: -1}
                    })
                    .then(() => res.status(200).json({ message: 'Sauce unliked!'}))
                    .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {  
                        $pull : {usersDisliked: req.body.userId},
                         $inc : {dislikes: -1}
                    })
                    .then(() => res.status(200).json({ message: 'Sauce undisliked!'}))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
            break;

        default: //SHOULDN'T HAPPEN
            res.status(400).json({ error });
    }
};