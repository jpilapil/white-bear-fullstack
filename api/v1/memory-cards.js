// the memory-cards resource

const express = require("express");
const router = express.Router();
const db = require("../../db");
// const { toJson, toSafeParse } = require("../../utils/helpers");
const selectAllCards = require("../../queries/selectAllCards");

// @route      GET api/v1/memory-cards
// @desc       get all memory cards for a user by search term and order
// @access     Public

router.get("/", (req, res) => {
  console.log(req.query);
  const { userId, searchTerm, order } = req.query;

  let constructedSearchTerm;
  if (searchTerm === "" || searchTerm === undefined) {
    constructedSearchTerm = "%%";
  } else {
    constructedSearchTerm = `%${searchTerm}%`;
  }

  /* https://www.npmjs.com/package/mysql#escaping-query-values
   used for added security */
  db.query(selectAllCards, [
    userId,
    constructedSearchTerm,
    constructedSearchTerm,
    order,
  ])
    .then((dbRes) => {
      // logic executed on successful response
      // console.log(dbRes);
      res.json(dbRes);
    })
    .catch((err) => {
      // logic executed on failed response
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
