const { Router } = require('express');
const User = require('../models/User');
const UserService = require('../services/UserService');
const { sign } = require('../utils/jwtToken.js');
const HttpError = require('../utils/HttpError.js');

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

.post('/', async (req, res, next) => {
  try {
    const user = await UserService.create(req.body);
    console.log('req.body', req.body);
    res.json(user);
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

.get('/:id', async (req, res, next) => {
  try {
    const singleUser = await User.getById(req.params.id);
    res.json(singleUser);
  } catch (error) {
    next (error);
  }
})

.get('/verify', (req, res) => {
  res.json(req.user);
})