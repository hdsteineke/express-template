const { Router } = require('express');
const User = require('../models/User');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()

.post('/', async (req, res, next) => {
  try {
    const user = await UserService.create(req.body);
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

.get('/users')