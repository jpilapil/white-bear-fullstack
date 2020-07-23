const { EMAIL_REGEX } = require("../utils/helpers");
const db = require("../db");

module.exports = function getLoginEmailError(email) {
  if (email === "") {
    return "Please enter your email address.";
  }
  if (EMAIL_REGEX.test(email) === false) {
    return "Please enter a valid email address.";
  }

  return "";
};
