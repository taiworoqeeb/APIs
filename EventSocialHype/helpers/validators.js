const { body, validationResult } = require("express-validator");

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
    body("email", "email is required").isEmail(),
    body("name", "name is required").notEmpty(),
    body("username", "username is required").notEmpty(),
    body("phone", "phone is required").notEmpty(),
    body("business", "business is required").notEmpty(),
    body("role", "role is required").notEmpty(),
    body("address", "address is required").notEmpty(),
    body("state", "state is required").notEmpty(),
    body("city", "city is required").notEmpty(),
    body("country", "country is required").notEmpty(),
    body(
      "password",
      "Enter Password with length of 5 or more characters"
    ).isLength({ min: 5 }),
  ];
};

const loginValidation = () => {
  return [
    body("email", "email is required").isEmail(),
    body("password", "Password is required").isLength({ min: 5 }),
  ];
};

const codeValidation = () => {
  return [
    body("email", "email is required").isEmail()
  ];
};

const tokenValidation = () => {
  return [
    body("email", "email is required").isEmail(),
    body("token", "token is required").notEmpty(),
  ];
};

const changePasswordValidation = () => {
  return [
    body("password", "Password is required").isLength({ min: 5 }),
    body("confirmPassword", "Confirm Password is required").isLength({
      min: 5,
    }),
    body("oldPassword", "Old Password is required").isLength({ min: 5 }),
  ];
};

const eventValidation = () => {
  return [
    body("type", "Event Type is required").notEmpty(),
    body("title", "Event Title is required").notEmpty(),
    body("description", "Event description is required").notEmpty(),
    body("organizers", "Event organizers is required").notEmpty(),
    body("address", "Address is required").notEmpty(),
    body("city", "City is required").notEmpty(),
    body("state", "State is required").notEmpty(),
    body("country", "Country is required").notEmpty(),
    body("eventDate", "Event Date is required").notEmpty(),
    body("eventTime", "Event Time is required").notEmpty(),
    body("images", "Event Image url is required").notEmpty(),
  ];
};

const bankValidation = () => {
  return [
    body("account_name", "Account Name is required").notEmpty(),
    body("account_number", "Account Number is required").notEmpty(),
    body("bank_name", "Bank Name is required").notEmpty(),
  ];
};

const accountValidation = () => {
  return [
    body("account_number", "Account Number is required").notEmpty(),
    body("bank_code", "Bank Code is required").notEmpty(),
  ];
};

const reviewValidation = () => {
  return [
    body("eventId", "Event Id is required").isUUID(),
    body("star", "Star amount is required and range between 1-5").isFloat({min: 1, max: 5}),
  ];
};

const commentValidation = () => {
  return [
    body("eventId", "Event Id is required").isUUID(),
    body("comment", "Comment is required").notEmpty(),
  ];
};

const donationValidation = () => {
  return [
    body("eventId", "Event Id is required").isUUID(),
    body("amount", "Amount Donated is required").isFloat(),
    body("method", "Donation Method used is required").notEmpty(),
  ];
};

const purchaseTicketValidation = () => {
  return [
    body("eventTicketId", "Event Ticket Id is required").isUUID(),
    body("method", "Donation Method used is required").notEmpty(),
  ];
};

const inviteValidation = () => {
  return [
    body("eventId", "Event Id is required").isUUID(),
    body("inviteId", "Invite Id is required").isUUID(),
    body("status", "Status is required").notEmpty(),
  ];
};

const fundwalletValidation = () => {
  return [
    body("amount", "Amount is required").notEmpty(),
    body("reference", "Reference is required").notEmpty(),
  ];
};

const promoteValidation = () => {
  return [
    body("eventId", "Event Id is required").isUUID(),
    body("planId", "Promotion Plan Id is required").isUUID(),
    body("type", "Promotion Type is required").notEmpty(),
  ];
};

const commentReviewValidation = () => {
  return [
    body("commentId", "Comment Id is required").isUUID(),
    body("star", "Star amount is required and range between 1-5").isFloat({min: 1, max: 5}),
  ];
};

const forgotPasswordValidation = () => {
  return [
    body("email", "Email is required").isEmail(),
      body("password", "Password is required").isLength({ min: 5 }),
      body("confirmPassword", "Confirm Password is required").isLength({
        min: 5,
      }),
  ];
};

const marchendiseValidation = () => {
  return [
    body("eventId", "Event Id is required").isUUID(),
    body("title", "Title is required").notEmpty(),
    body("image", "Image is required").notEmpty(),
    body("amount", "Amount is required").isNumeric(),
  ];
};

const purchaseMerchandiseValidation = () => {
  return [
    body("merchandiseId", "Event Merchandise Id is required").isUUID(),
    body("method", "Payment Method used is required").notEmpty(),
  ];
};

const withdrawalValidation = () => {
  return [
    body("acct_name", "acct_name is required").notEmpty(),
    body("acct_number", "acct_number is required").notEmpty(),
    body("bank_name", "bank_name is required").notEmpty(),
    body("bank_code", "bank_code is required").notEmpty(),
    body("amount", "amount is required").notEmpty(),
  ];
};

module.exports = {
  validate,
  okvalidate,
  registerValidation,
  codeValidation,
  tokenValidation,
  loginValidation,
  changePasswordValidation,
  fundwalletValidation,
  eventValidation,
  bankValidation,
  accountValidation,
  reviewValidation,
  commentValidation,
  donationValidation,
  inviteValidation,
  fundwalletValidation,
  purchaseTicketValidation,
  promoteValidation,
  commentReviewValidation,
  forgotPasswordValidation,
  marchendiseValidation,
  purchaseMerchandiseValidation,
  withdrawalValidation
};
