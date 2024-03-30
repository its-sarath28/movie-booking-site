export const globalErrorHandler = (err, req, res, next) => {
  //message
  const message = err.message;
  //status
  const status = err.status ? err.status : "Failed";
  const statusCode = err.statusCode ? err.statusCode : 500;
  //stack
  const stack = err.stack;
  //Send the response
  res.status(statusCode).json({
    message,
    status,
    stack,
  });
  console.log(err.stack);
};
