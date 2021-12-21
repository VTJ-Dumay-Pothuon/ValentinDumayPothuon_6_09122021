const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet");
const path = require('path');
const app = express();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


require("dotenv").config();
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mytoq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Express app secure toolset
app.use(helmet());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// Required by multer to save pictures on the server
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;