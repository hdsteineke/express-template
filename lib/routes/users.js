const { Router } = require('express');
const User = require('../models/User');
const UserService = require('../services/UserService');
const HttpError = require('../utils/HttpError.js');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');


const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const isSecure = process.env.SECURE_COOKIES === 'true';
const COOKIE_NAME = process.env.COOKIE_NAME;
const cookieOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isSecure ? 'none' : 'strict',
  maxAge: ONE_DAY_IN_MS,
};

module.exports = Router()

//inserts a new user into the database
.post('/', async (req, res, next) => {
  try {
    const user = await UserService.create(req.body);
    res.json(user);
  } catch (error) {
    next (error);
  }
})

//signs in users that already exist
.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //const sessionToken = await UserService.signIn({ email, password });
    const user = await User.getByEmail(email);
    
    let isValid = false;
    if (user) {
      isValid = await user.isValidPassword(password);
    }

    if (!isValid) {
      throw new HttpError('Invalid credentials', 400);
    }

    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .json(user);
  } catch (error) {
    next (error);
  }
})

.get('/', async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    next (error);
  }
})

.get('/verify', authenticate, (req, res) => {
  res.json(req.user);
})


.get('/:id', async (req, res, next) => {
  try {
    const singleUser = await User.getById(req.params.id);
    res.json(singleUser);
  } catch (error) {
    next (error);
  }
})
