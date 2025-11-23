const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map((e) => ({
    field: e.path,
    msg: e.msg,
  }));

  return res.status(400).json({
    message: "Validation error",
    errors: formatted,
  });
};

module.exports = validate;
