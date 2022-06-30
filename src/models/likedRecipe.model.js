const db = require('../config/pg');

module.exports = {
  getAllLikedRecipe: (sort, sortType, limit, offset, level) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM liked_recipes ${
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
  getCountLikedRecipe: () =>
    new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS total FROM liked_recipes`, (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res.rows[0].total);
      });
    }),
  findBy: (field, search) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.title, recipes.image, users.name, users.photo, liked_recipes.id,
        liked_recipes.user_id, liked_recipes.recipe_id, liked_recipes.created_at AS date 
        FROM liked_recipes
        INNER JOIN recipes ON liked_recipes.recipe_id = recipes.id
        INNER JOIN users ON liked_recipes.user_id = users.id WHERE ${field} = $1`,
        [search],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  createLikedRecipe: (data) =>
    new Promise((resolve, reject) => {
      const { id, userId, recipeId } = data;
      db.query(
        `INSERT INTO liked_recipes (id, user_id, recipe_id) VALUES ($1, $2, $3)`,
        [id, userId, recipeId],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(data);
        }
      );
    }),
  deleteLikedRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query(`DELETE FROM liked_recipes WHERE id = $1`, [id], (err) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(id);
      });
    }),
};
