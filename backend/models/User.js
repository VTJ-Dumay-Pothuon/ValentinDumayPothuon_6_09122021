const mongoose = require('mongoose');
const mongooseErrors = require('mongoose-errors')
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseErrors);

mongoose.model('User', userSchema)
    .create()
    .catch(error => {
        res.status(400).json({ error });
        done();
    });

module.exports = mongoose.model('User', userSchema);