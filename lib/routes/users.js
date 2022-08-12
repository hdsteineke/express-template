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
    //destructuring the email and password  off the req.body
    const { email, password } = req.body;
    //retrieving user by matching email to the database
    const user = await User.getByEmail(email);
    //set validated user to false by default
    let isValid = false;
    //if there is a valid user, check their password against the hashed passwords in database (function defined in User.js)
    if (user) {
      isValid = await user.isValidPassword(password);
    }
    //if user is not valid (does nt exist in database), they receive an error message
    if (!isValid) {
      throw new HttpError('Invalid credentials', 400);
    }
    //signing the token with the user's data, the jwt secret and the expiration
    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });
    //setting the cookie on the response body??
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
//fetches a list of all users (realistically I probably don't need this route)
.get('/', async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    next (error);
  }
})
//verifies an existing user upon sign in 
.get('/verify', authenticate, (req, res) => {
  res.json(req.user);
})

//fetches a specific user by their id
.get('/:id', async (req, res, next) => {
  try {
    const singleUser = await User.getById(req.params.id);
    res.json(singleUser);
  } catch (error) {
    next (error);
  }
})
