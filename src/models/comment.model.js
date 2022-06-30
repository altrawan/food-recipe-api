const db = require('../config/pg');

module.exports = {
  getAllComment: (field, search, sort, sortType, limit, offset, level) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM comments WHERE ${field} ILIKE ('%${search}%')  ${
          level === 1 ? 'AND is_active = true' : ''
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
        `SELECT comments.id, comments.comment_text, comments.user_id, comments.recipe_id,
        users.name, users.photo, comments.created_at AS date
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
        `SELECT comments.id, comments.comment_text, comments.user_id, comments.recipe_id,
        users.name, users.photo, comments.created_at AS date 
        FROM comments INNER JOIN users ON comments.user_id = users.id
        INNER JOIN recipes ON comments.recipe_id = recipes.id WHERE recipe_id=$1`,
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
  updateStatus: (status, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE comments SET is_active = $1, updated_at = $2 WHERE id = $3`,
        [status, new Date(Date.now()), id],
        (err) => {
          if (err) {
            reject(new Error(`SQL : ${err.message}`));
          }
          const data = {
            id,
            status: status === 1 ? 'active' : 'deactive',
          };
          resolve(data);
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
