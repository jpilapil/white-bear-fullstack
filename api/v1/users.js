// the users resource
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../../db");
const insertUser = require("../../queries/insertUser");
const selectUserById = require("../../queries/selectUserById");
const selectUserbyEmail = require("../../queries/selectUserByEmail");
const { toHash } = require("../../utils/helpers");
const getSignUpEmailError = require("../../validation/getSignUpEmailError");
const getSignUpPasswordError = require("../../validation/getSignUpPasswordError");
const getLoginEmailError = require("../../validation/getLoginEmailError");
const getLoginPasswordError = require("../../validation/getLoginPasswordError");
const jwt = require("jsonwebtoken");

// @route      POST api/v1/users
// @desc       create a new user
// @access     Public
router.post("/", async (req, res) => {
  const { id, email, password, createdAt } = req.body; // grab variables from req.body
  const emailError = await getSignUpEmailError(email); // await for database query
  const passwordError = getSignUpPasswordError(password, email);
  let dbError = "";
  if (emailError === "" && passwordError === "") {
    // if there is no email and passowrd error, post to database
    const user = {
      id: id,
      email: email,
      password: await toHash(password),
      created_at: createdAt,
    };
    console.log(user);
    db.query(insertUser, user)
      .then(() => {
        db.query(selectUserById, id)
          .then((users) => {
            const user = users[0];
            res.status(200).json({
              // send json with values from database
              id: user.id,
              email: user.email,
              createdAt: user.created_at,
            });
          })
          .catch((err) => {
            console.log(err);
            dbError = `${err.code} ${err.sqlMessage}`;
            res.status(400).json({ dbError });
          });
      })
      .catch((err) => {
        console.log(err);
        dbError = `${err.code} ${err.sqlMessage}`;
        res.status(400).json({ dbError });
      });
  } else {
    res.status(400).json({ emailError, passwordError });
  }
});

// @route      POST api/v1/users/auth
// @desc       Authorize user via email and password in db
// @access     Public
router.post("/auth", async (req, res) => {
  const { email, password } = req.body; // grab variables from req.body
  const emailError = getLoginEmailError(email); // await for database query
  const passwordError = await getLoginPasswordError(password, email);
  let dbError = "";
  if (emailError === "" && passwordError === "") {
    // return the user to the client
    db.query(selectUserbyEmail, email)
      .then((users) => {
        const user = {
          id: users[0].id,
          email: users[0].email,
          createdAt: users[0].created_at,
        };
        // contains all info from user object
        const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, {
          expiresIn: "7d",
        });

        res.status(200).json(accessToken);
      })
      .catch((err) => {
        console.log(err);
        dbError = `${err.code} ${err.sqlMessage}`;
        res.status(400).json({ dbError });
      });
  } else {
    // return 400 status to client
    res.status(400).json({ emailError, passwordError });
  }
});

module.exports = router;
