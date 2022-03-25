const db = require('../config/pg');

module.exports = {
  getLikedRecipeByUser: (id) =>
    new Promise((resolve, reject) => {
      db.query(`SELECT liked_recipe`);
    }),
  getLikedRecipeById: (id) => new Promise((resolve, reject) => {}),
  
};
