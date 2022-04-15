const db = require('../config/pg');

module.exports = {
  getRecipeActive: (key, search, sort, sortType, limit, offset) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.title, recipes.image, recipes.ingredients, recipes.video, users.name, 
        CASE WHEN recipes.is_active = 0 THEN 'Not Active' ELSE 'Active' END AS status,
        to_char(recipes.created_at, 'FMDay, DD FMMonth YYYY HH24:MI:SS') AS date
        FROM recipes INNER JOIN users ON recipes.user_id = users.id WHERE recipes.is_active = 1
        AND ${key} ILIKE $1 ORDER BY ${sort} ${sortType} LIMIT $2 OFFSET $3`,
        [search, limit, offset],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
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
