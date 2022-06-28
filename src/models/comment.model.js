const db = require('../config/pg');

module.exports = {
  getAllComment: (field, search, sort, sortType, limit, offset, level) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM comments WHERE ${field} ILIKE $1 ${
          level === 1 ? 'AND is_active = true' : ''
        } ORDER BY ${sort} ${sortType} LIMIT $2 OFFSET $3`,
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
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res.rows[0].total);
      });
    }),
  getCommentById: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.title, users.photo, users.name, comments.comment_text, 
        to_char(comments.created_at, 'FMDay, DD FMMonth YYYY HH24:MI:SS') AS date
        FROM comments INNER JOIN users ON comments.user_id = users.id
        INNER JOIN recipes ON comments.recipe_id = recipes.id WHERE comments.id = $1`,
        [id],
        (err, res) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          resolve(res);
        }
      );
    }),
  getCommentByRecipe: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT recipes.title, users.photo, users.name, comments.comment_text, 
        to_char(comments.created_at, 'FMDay, DD FMMonth YYYY HH24:MI:SS') AS date
        FROM comments INNER JOIN users ON comments.user_id = users.id
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
  getDetailComment: (id) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT * FROM comments WHERE id = $1`, [id], (err, res) => {
        if (err) {
          reject(new Error(`SQL : ${err.message}`));
        }
        resolve(res);
      });
    }),
  createComment: (data) =>
    new Promise((resolve, reject) => {
      const { id, userId, recipeId, commentText } = data;
      db.query(
        `INSERT INTO comments (id, user_id, recipe_id, comment_text, is_active) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [id, userId, recipeId, commentText, true],
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
      const { commentText } = data;
      db.query(
        `UPDATE comments SET comment_text = $1, updated_at = $2 WHERE id = $3`,
        [commentText, new Date(Date.now()), id],
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
