// Custom async handler function to avoid Errors

const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqHandler(req, res, next))
      .catch((err) => {
        console.error('Async handler error:', err);
        next(err); // Pass the error to Express's error handling middleware
      });
  };
};

export { asyncHandler };