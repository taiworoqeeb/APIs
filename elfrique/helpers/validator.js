const { check, body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ message: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

const okvalidate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};

const registerValidation = () => {
  return [
    check("email", "Your email is not valid")
      .not()
      .isEmpty()
      .isEmail()
      .normalizeEmail(),
    check("password", "Enter Password with length of 5 or more characters")
      .not()
      .isEmpty()
      .isLength({ min: 5 }),
    check("confirmpassword", "Passwords do not match").custom(
      (value, { req }) => value === req.body.password
    ),
    check("firstname", "Enter First Name").not().isEmpty(),
    check("lastname", "Enter Last Name").not().isEmpty(),
    check("phonenumber", "Enter Phone Number").not().isEmpty().isInt(),
    check("referral_email", "Enter Referral Email").optional(),
  ];
};

const loginValidation = () => {
  return [
    body("email", "email is required").isEmail(),
    body("password", "Password is required").isLength({ min: 5 }),
  ];
};

const resetPasswordValidation = () => {
  return [
    body("email", "email is required").isEmail(),
    body("password", "Password is required").isLength({ min: 5 }),
    body("confirmpassword", "Passwords do not match").custom(
      (value, { req }) => value === req.body.password
    ),
  ];
};

const changePasswordValidation = () => {
  return [
    body("oldPassword", "Enter Old Password")
      .not()
      .isEmpty()
      .isLength({ min: 5 }),
    body("newPassword", "Enter New Password")
      .not()
      .isEmpty()
      .isLength({ min: 5 }),
    body("confirmpassword", "Passwords do not match").custom(
      (value, { req }) => value === req.body.newPassword
    ),
  ];
};

const createVoteValidation = () => {
  return [
    body("title", "Enter Title").not().isEmpty(),
    body("votelimit", "Enter votelimit").not().isEmpty(),
    body("startdate", "Enter Start Date").not().isEmpty(),
    body("closedate", "Enter End Date").not().isEmpty(),
    //body("fee", "Enter fee").not().isEmpty(),
    body("type", "Enter Type").not().isEmpty(),
    //body("packagestatus", "Enter packagestatus").not().isEmpty(),
    body("timezone", "Enter timezone").not().isEmpty(),
    body("paymentgateway", "Enter payment gateway").not().isEmpty(),
    //body("image", "Enter Image").not().isEmpty(),
  ];
};

const createAwardValidation = () => {
  return [
    body("title", "Enter Title").not().isEmpty(),
    // body("description", "Enter Description").not().isEmpty(),
    body("type", "Enter Type").not().isEmpty(),
    body("votelimit", "Enter votelimit").not().isEmpty(),
    body("startdate", "Enter Start Date").not().isEmpty(),
    body("closedate", "Enter End Date").not().isEmpty(),
    body("timezone", "Enter timezone").not().isEmpty(),
    body("paymentgateway", "Enter payment gateway").not().isEmpty(),
    // body("fee", "Enter fee").not().isEmpty(),
    body("packagestatus", "Enter packagestatus").not().isEmpty(),
    body("categories", "Enter categories").not().isEmpty(),
    //check("image", "Enter Image").not().isEmpty(),
  ];
};

const createEventValidation = () => {
  return [
    body("title", "Enter Title").not().isEmpty(),
    body("country", "Enter Country").not().isEmpty(),
    body("state", "Enter State").not().isEmpty(),
    body("city", "Enter City").not().isEmpty(),
    body("venue", "Enter Venue").not().isEmpty(),
    body("startdate", "Enter Start Date").not().isEmpty(),
    body("enddate", "Enter End Date").not().isEmpty(),
    body("timezone", "Enter timezone").not().isEmpty(),
    body("paymentgateway", "Enter payment gateway").not().isEmpty(),
    /* body("description", "Enter event description").not().isEmpty(), */
    body("category", "Enter category").not().isEmpty(),
    body("organisation", "Enter organisation name").not().isEmpty(),
  ];
};

const createTicketsValidation = () => {
  return [
    body("name", "Enter Ticket Name").not().isEmpty(),
    body("price", "Enter Price").not().isEmpty(),
    body("quantity", "Enter Quantity").not().isEmpty(),
    body("salesstart", "Enter Start Date").not().isEmpty(),
    body("salesend", "Enter End Date").not().isEmpty(),
  ];
};

const createTriviaValidation = () => {
  return [
    body("title", "Enter Title").not().isEmpty(),
    body("duration", "Enter duration").not().isEmpty(),
    body("type", "Enter type of trivia; free or paid").not().isEmpty(),
  ];
};

const createFormValidation = () => {
  return [
    body("title", "Enter Title").not().isEmpty(),
    body("type", "Enter type of form; free or paid").not().isEmpty(),
    body("startdate", "Enter Start Date").not().isEmpty(),
    body("closedate", "Enter End Date").not().isEmpty(),
  ];
};

const createQuestionValidation = () => {
  return [
    body("question", "Enter Question").not().isEmpty(),
    body("type", "Enter type of question").not().isEmpty(),
  ];
};

module.exports = {
  validate,
  okvalidate,
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  changePasswordValidation,
  createVoteValidation,
  createAwardValidation,
  createEventValidation,
  createTicketsValidation,
  createTriviaValidation,
  createFormValidation,
  createQuestionValidation,
};
