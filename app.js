const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const strategies = require('./src/middlewares/passport');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');

const app = express();

app.use('/assets', express.static(`${__dirname}/../files`));

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/** Routes */
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database is ON'))
  .catch((error) => console.log(error));

app.use(passport.initialize());
app.use(passport.authenticate());
app.use(passport.session());
require('./src/middlewares/passport');

passport.use('jwt', strategies.jwt);

module.exports = app;
