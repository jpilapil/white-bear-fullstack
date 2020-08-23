// the memory-cards resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
// const { toJson, toSafeParse } = require("../../utils/helpers");
const selectAllCards = require("../../queries/selectAllCards");
const insertMemoryCard = require("../../queries/insertMemoryCard.js");
const updateMemoryCard = require("../../queries/updateMemoryCard.js");
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
      return res.status(200).json(camelCaseMemoryCards);
    })
    .catch((err) => {
      // logic executed on failed response
      console.log(err);
      return res.status(400).json(err);
    });
});

// @route      POST api/v1/memory-cards
// @desc       Post a memory card to the memory cards resource
// @access     Private

router.post("/", validateJwt, (req, res) => {
  // create user var with req.user which is located in validateJwt
  const user = req.user;
  const {
    id,
    imagery,
    answer,
    createdAt,
    nextAttemptAt,
    lastAttemptAt,
    totalSuccessfulAttempts,
    level,
  } = req.body;
  const memoryCard = {
    id: id,
    imagery: imagery,
    answer: answer,
    user_id: user.id,
    created_at: createdAt,
    next_attempt_at: nextAttemptAt,
    last_attempt_at: lastAttemptAt,
    total_successful_attempts: totalSuccessfulAttempts,
    level: level,
  };
  console.log(memoryCard);
  db.query(insertMemoryCard, memoryCard)
    .then((dbRes) => {
      //success
      console.log("Created memory card in the database", dbRes);
      // return with a status response, needs json
      return res.status(200).json({ success: "Card created :)" });
    })
    .catch((err) => {
      //err
      console.log(err);
      // return with an error status response
      const dbError = `${err.code} ${err.sqlMessage}`;
      return res.status(400).json({ dbError });
    });
});

// @route      PUT api/v1/memory-cards/:id
// @desc       Update a memory card in the memory cards resource
// @access     Private

router.put("/:id", validateJwt, (req, res) => {
  // create user var with req.user which is located in validateJwt
  const user = req.user;
  const {
    id,
    imagery,
    answer,
    createdAt,
    nextAttemptAt,
    lastAttemptAt,
    totalSuccessfulAttempts,
    level,
  } = req.body;
  const memoryCard = {
    id: id,
    imagery: imagery,
    answer: answer,
    user_id: user.id,
    created_at: createdAt,
    next_attempt_at: nextAttemptAt,
    last_attempt_at: lastAttemptAt,
    total_successful_attempts: totalSuccessfulAttempts,
    level: level,
  };
  console.log(memoryCard);
  db.query(updateMemoryCard, [memoryCard, id])
    .then((dbRes) => {
      //success
      console.log("Updated memory card in the database", dbRes);
      // return with a status response, needs json
      return res.status(200).json({ success: "Card updated." });
    })
    .catch((err) => {
      //err
      console.log(err);
      // return with an error status response
      const dbError = `${err.code} ${err.sqlMessage}`;
      return res.status(400).json({ dbError });
    });
});

module.exports = router;
