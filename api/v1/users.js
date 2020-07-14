// the users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUser = require("../../queries/selectUser");
const { toJson, toSafeParse } = require("../../utils/helpers");

// @route      GET api/v1/users
// @desc       get a valid user via email and password
// @access     Public
router.get("/", (req, res) => {
  db.query(selectUser("bob@gmail.com", "replace_me"))
    .then((dbRes) => {
      // logic executed on successful response
      const user = toSafeParse(toJson(dbRes)); // converts row data packet to json, returns an array
      console.log(user);
      res.json(user);
    })
    .catch((err) => {
      // logic executed on failed response
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
