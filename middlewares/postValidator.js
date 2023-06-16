const { check, validationResult } = require("express-validator");

// Validate Post Data
exports.validatePostData = [
  check("title").notEmpty().withMessage("Title is missing!"),
  check("short_ans").notEmpty().withMessage("Short answer is missing!"),
  check("description").notEmpty().withMessage("Description is missing!"),
  check("category").notEmpty().withMessage("Category is missing!"),
];

// input validation Result
exports.validationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return only messages
    let ErrorMessages = [];
    errors.array().forEach((data) => {
      ErrorMessages.push(data.msg);
    });
    return next(ErrorMessages);
  }
  next();
};
