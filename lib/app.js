const express = require('express');
const cookieParser = require('cookie-parser');
const users = require('./routes/users');

const app = express();

app.use(express.json());
app.use(cookieParser());

//App routes
app.use('/api/v1/users', users);

//app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;