
// Middleware for validation
export const validateUser = (schema) => {
  return (req, res, next) => {
    const inputData = { ...req.body, ...req.params, ...req.query };

    if (req.file || req.files?.length) {
      inputData.File = req.file || req.files;
    }

    const { error } = schema.validate(inputData, { abortEarly: false });
    if (error) {
      return res.status(401).json({
        message: "Validation error",
        details: error.details
      });
    }
    next();
  };
};
