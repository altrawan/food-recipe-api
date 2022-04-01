const db = require('../config/pg');

module.exports = {
  getLatestRecipe: (limit) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM recipes ORDER BY created_at DESC LIMIT $1`,
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
