const { verify } = require('../utils/jwtToken.js');

module.exports = async (req, res, next) => {
  try {
    //defining the cookie on the request object as a variable 'cookie'
    const cookie = req.cookies[process.env.COOKIE_NAME];

    // Check the httpOnly session cookie for the current user
    if (!cookie) throw new Error('You must be signed in to continue');

    // verify the jwt token stored in the cookie, then attach to each request
    const user = verify(cookie);

    //after verification, setting the user on the request object to the current user
    req.user = user;

    //prompts code to read next lines in the event an error occurs
    next();
    //catches the error
  } catch (err) {
    //throws a status code so we can easily see the nature of the error
    err.status = 401;
    next(err);
  }
};