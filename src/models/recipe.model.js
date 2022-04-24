const db = require('../config/pg');

module.exports = {
  getListRecipe: (key, search, sort, sortType, limit, offset) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.id, recipes.title, recipes.image, recipes.ingredients, recipes.video, users.name, 
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
        `SELECT recipes.id, recipes.title, recipes.image, users.name, 
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
  getAllRecipes: (key, search, sort, sortType, limit, offset) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.id, recipes.title, recipes.image, recipes.ingredients, recipes.video,  
        CASE WHEN recipes.is_active = 0 THEN 'Not Active' ELSE 'Active' END AS status, 
        users.name, to_char(recipes.created_at, 'FMDay, DD FMMonth YYYY HH24:MI:SS') AS date
        FROM recipes INNER JOIN users ON recipes.user_id = users.id 
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
  getCountRecipe: () =>
    new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS total FROM recipes`, (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res.rows[0].total);
      });
    }),
  getRecipeById: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.id, recipes.title, recipes.image, recipes.ingredients, recipes.video, 
        users.name, users.photo, recipes.created_at AS date
        FROM recipes INNER JOIN users ON recipes.user_id = users.id WHERE recipes.id = $1`,
        [id],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getRecipeByUser: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.id, recipes.title, recipes.image, users.name, 
        to_char(recipes.created_at, 'FMDay, DD FMMonth YYYY HH24:MI:SS') AS date
        FROM recipes INNER JOIN users ON recipes.user_id = users.id WHERE recipes.user_id = $1`,
        [id],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getDetailRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM recipes WHERE id = $1`, [id], (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res);
      });
    }),
  getDetailRecipeByUser: (id) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM recipes WHERE user_id = $1`, [id], (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res);
      });
    }),
  createRecipe: (data) =>
    new Promise((resolve, reject) => {
      const { id, title, image, ingredients, video, is_active, user_id } = data;
      db.query(
        `INSERT INTO recipes VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, title, image, ingredients, video, is_active, user_id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(data);
        }
      );
    }),
  updateRecipe: (data, id) =>
    new Promise((resolve, reject) => {
      const { title, image, ingredients, video, updated_at } = data;
      db.query(
        `UPDATE recipes SET title = $1, image = $2, ingredients = $3, video = $4, updated_at = $5 WHERE id = $6`,
        [title, image, ingredients, video, updated_at, id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          const newRes = {
            id,
            ...data,
          };
          resolve(newRes);
        }
      );
    }),
  updateStatus: (is_active, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE recipes SET is_active = $1, updated_at = $2 WHERE id = $3`,
        [is_active, new Date(Date.now()), id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          const data = {
            id,
            status: is_active === 1 ? 'Active' : 'Not Active',
          };
          resolve(data);
        }
      );
    }),
  deleteRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query(`DELETE FROM recipes WHERE id = $1`, [id], (err) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(id);
      });
    }),
};
