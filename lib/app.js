const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

//App routes
app.use('/api/v1/users', users);

module.exports = app;