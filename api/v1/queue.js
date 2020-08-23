// the queue resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectQueue = require("../../queries/selectQueue");
const validateJwt = require("../../utils/validateJwt");

// @route      GET api/v1/queue
// @desc       get all queued memory cards for a user
// @access     Private

router.get("/", validateJwt, (req, res) => {
  console.log(req.query);

  const userId = req.user.id;

  /* https://www.npmjs.com/package/mysql#escaping-query-values
    used for added security */
  db.query(selectQueue, userId)
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
      return res.status(200).json(camelCaseMemoryCards);
    })
    .catch((err) => {
      // logic executed on failed response
      console.log(err);
      res.status(400).json(err);
    });
});
module.exports = router;
