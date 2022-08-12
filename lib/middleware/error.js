module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  let message = err.message;
  //specifically defining our 500 errors for more clarity
  if (status === 500 && process.env.NODE_ENV === 'production') {
    message = 'Unexpected server error';
  }
  //setting the response on the status object to the current error status
  res.status(status);

  
  if (process.env.NODE_ENV !== 'test' || status === 500) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  
  res.send({ status, message });
};