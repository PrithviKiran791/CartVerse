export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Explicit application errors
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;

    message = err.errors
      .map((error) => error.message)
      .join(', ');
  }

  // Sequelize unique constraint violation
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;

    const field = err.errors?.[0]?.path || 'field';

    message = `Duplicate value for field: ${field}`;
  }

  // Sequelize foreign key violation
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference to related resource';
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    statusCode = 500;

    if (process.env.NODE_ENV !== 'production') {
      message = err.message;
    } else {
      message = 'Database error';
    }
  }

  res.status(statusCode).json({
    message,
    stack:
      process.env.NODE_ENV === 'production'
        ? undefined
        : err.stack,
  });
};