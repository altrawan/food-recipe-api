const db = require('../config/pg');

module.exports = {
  getLatestRecipe: (limit) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.title, recipes.image, users.name, 
        to_char(recipes.created_at, 'FMDay, DD FMMonth YYYY HH24:MI:SS') AS date 
        FROM recipes INNER JOIN users ON recipes.user_id = users.id 
        ORDER BY recipes.created_at DESC LIMIT $1`,
        [limit],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getPopularRecipe: () =>
    new Promise((resolve, reject) => {
      db.query();
    }),
};
