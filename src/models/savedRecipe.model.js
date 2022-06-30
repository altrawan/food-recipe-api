const db = require('../config/pg');

module.exports = {
  getAllSavedRecipe: (sort, sortType, limit, offset, level) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM saved_recipes ${
          level === 1 ? 'WHERE is_active = true' : ''
        } ORDER BY ${sort} ${sortType} LIMIT $1 OFFSET $2`,
        [limit, offset],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getCountSavedRecipe: () =>
    new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS total FROM saved_recipes`, (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res.rows[0].total);
      });
    }),
  findBy: (field, search) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.title, recipes.image, users.name, users.photo, saved_recipes.id,
        saved_recipes.user_id, saved_recipes.recipe_id, saved_recipes.created_at AS date 
        FROM saved_recipes
        INNER JOIN recipes ON saved_recipes.recipe_id = recipes.id
        INNER JOIN users ON saved_recipes.user_id = users.id WHERE ${field} = $1`,
        [search],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  createSavedRecipe: (data) =>
    new Promise((resolve, reject) => {
      const { id, userId, recipeId } = data;
      db.query(
        `INSERT INTO saved_recipes (id, user_id, recipe_id) VALUES ($1, $2, $3)`,
        [id, userId, recipeId],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(data);
        }
      );
    }),
  deleteSavedRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query(`DELETE FROM saved_recipes WHERE id = $1`, [id], (err) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(id);
      });
    }),
};
