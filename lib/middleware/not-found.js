module.exports = (req, res, next) => {
  //defining how to handle a not-found error 
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};