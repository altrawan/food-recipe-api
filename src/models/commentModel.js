const db = require('../config/pg');

module.exports = {
  getAllComments: (key, search, sort, sortType, limit, offset) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT comments.id, users.id AS user_id, users.name, recipes.id AS recipe_id, recipes.title, comments.comment_text 
        FROM comments INNER JOIN users ON comments.user_id = users.id
        INNER JOIN recipes ON comments.recipe_id = recipes.id 
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
  getCountComment: () =>
    new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) AS total FROM comments`, (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.sqlMessage}`));
        }
        resolve(res.rows[0].total);
      });
    }),
  getCommentById: (id) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM comments WHERE id = $1`, [id], (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res);
      });
    }),
  getCommentByRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.id, recipes.title, recipes.image, recipes.ingredients, recipes.video, comments.comment_text FROM comments 
        INNER JOIN recipes ON comments.recipe_id = recipes.id WHERE comments.recipe_id = $1`,
        [id],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  createComment: (data) =>
    new Promise((resolve, reject) => {
      const { id, user_id, recipe_id, comment_text } = data;
      db.query(
        `INSERT INTO comments VALUES ($1, $2, $3, $4)`,
        [id, user_id, recipe_id, comment_text],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(data);
        }
      );
    }),
  updateComment: (data, id) =>
    new Promise((resolve, reject) => {
      const { user_id, recipe_id, comment_text, updated_at } = data;
      db.query(
        `UPDATE comments SET user_id = $1, recipe_id = $2, comment_text = $3, updated_at = $4 WHERE id = $5`,
        [user_id, recipe_id, comment_text, updated_at, id],
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
  deleteComment: (id) =>
    new Promise((resolve, reject) => {
      db.query(`DELETE FROM comments WHERE id = $1`, [id], (err) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(id);
      });
    }),
};
