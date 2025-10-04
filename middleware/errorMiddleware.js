
const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const fields = Object.keys(err.errors);
    message = fields.map(field => err.errors[field].message).join(', ');
  }

  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `${field} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
