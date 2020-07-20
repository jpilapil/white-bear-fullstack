// the users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const insertUser = require("../../queries/insertUser");
const { toHash } = require("../../utils/helpers");
const getSignUpEmailError = require("../../validation/getSignUpEmailError");
const getSignUpPasswordError = require("../../validation/getSignUpPasswordError");

// @route      POST api/v1/users
// @desc       create a new user
// @access     Public
router.post("/", async (req, res) => {
  const { id, email, password, createdAt } = req.body;
  const emailError = getSignUpEmailError(email);
  const passwordError = getSignUpPasswordError(password);
  if (emailError === "" && passwordError === "") {
    const user = {
      id: id,
      email: email,
      password: await toHash(password),
      created_at: createdAt,
    };
    console.log(user);
    db.query(insertUser, user)
      .then((dbRes) => {
        console.log(dbRes);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400).json({ emailError, passwordError });
  }
});

module.exports = router;
