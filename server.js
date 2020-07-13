require("dotenv").config();
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: "white_bear_app",
});

connection.connect();

connection.query(
  `
  SELECT 
      *
   FROM
      memory_cards
   WHERE
      memory_cards.user_id = 'a70d566a-9701-449e-8556-554bfda5be2f'
         AND (memory_cards.imagery LIKE '%ash%'
         OR memory_cards.answer LIKE '%ash%')
   ORDER BY 
         memory_cards.total_successful_attempts DESC ,
         memory_cards.created_at DESC;
   `,
  (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  }
);

connection.end();
