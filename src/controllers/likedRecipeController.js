const { v4: uuidv4 } = require('uuid');
const likedRecipeModel = require('../models/likedRecipeModel');
const wrapper = require('../helpers/wrapper/wrapper');

module.exports = {
  getLikedRecipeByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await likedRecipeModel.getSavedRecipeByUser(id);
      if (result.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }
      return wrapper.response(
        res,
        200,
        `Success get liked recipe by id user ${id}`,
        result.rows
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  getLikedSavedById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await likedRecipeModel.getSavedRecipeById(id);
      if (result.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }
      return wrapper.response(
        res,
        200,
        `Success get data by id ${id}`,
        result.rows[0]
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  createLikedRecipe: async (req, res) => {
    try {
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  deleteLikedRecipe: async (req, res) => {
    try {
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
};
