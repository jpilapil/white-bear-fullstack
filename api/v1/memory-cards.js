// the memory-cards resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
// const { toJson, toSafeParse } = require("../../utils/helpers");
const selectAllCards = require("../../queries/selectAllCards");
const validateJwt = require("../../utils/validateJwt");

// @route      GET api/v1/memory-cards
// @desc       get all memory cards for a user by search term and order
// @access     Private

router.get("/", validateJwt, (req, res) => {
  console.log(req.query);
  const { searchTerm, order } = req.query;
  const userId = req.user.id;
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
    { toSqlString: () => order },
  ])
    .then((memoryCards) => {
      // logic executed on successful response
      // console.log(memoryCards);
      const camelCaseMemoryCards = memoryCards.map((memoryCard) => {
        return {
          id: memoryCard.id,
          imagery: memoryCard.imagery,
          answer: memoryCard.answer,
          userId: memoryCard.user_id,
          createdAt: memoryCard.created_at,
          nextAttemptAt: memoryCard.next_attempt_at,
          lastAttemptAt: memoryCard.last_attempt_at,
          totalSuccessfulAttempts: memoryCard.total_successful_attempts,
          level: memoryCard.level,
        };
      });
      res.json(camelCaseMemoryCards);
    })
    .catch((err) => {
      // logic executed on failed response
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
