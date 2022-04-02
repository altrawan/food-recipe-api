const db = require('../config/pg');

module.exports = {
  getAllLikedRecipe: (key, search, sort, sortType, limit, offset) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT liked_recipes.id, recipes.title, recipes.image, users.name, liked_recipes.created_at 
        FROM liked_recipes
        INNER JOIN recipes ON liked_recipes.recipe_id = recipes.id
        INNER JOIN users ON liked_recipes.user_id = users.id
        WHERE ${key} ILIKE $1 ORDER BY ${sort} ${sortType} LIMIT $2 OFFSET $3`,
        [search, limit, offset],
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
  getLikedRecipeById: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM liked_recipes WHERE id = $1`,
        [id],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getLikedRecipeByUser: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT liked_recipes.id, recipes.title, recipes.image, users.name, liked_recipes.created_at 
        FROM liked_recipes
        INNER JOIN recipes ON liked_recipes.recipe_id = recipes.id
        INNER JOIN users ON liked_recipes.user_id = users.id 
        WHERE liked_recipes.user_id = $1 ORDER BY created_at DESC`,
        [id],
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
      const { id, user_id, recipe_id } = data;
      db.query(
        `INSERT INTO liked_recipes VALUES ($1, $2, $3)`,
        [id, user_id, recipe_id],
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
