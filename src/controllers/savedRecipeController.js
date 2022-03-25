const { v4: uuidv4 } = require('uuid');
const savedRecipeModel = require('../models/savedRecipeModel');
const wrapper = require('../helpers/wrapper/wrapper');

module.exports = {
  getSavedRecipeByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await savedRecipeModel.getSavedRecipeByUser(id);
      if (result.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }
      return wrapper.response(
        res,
        200,
        `Success get saved recipe by id user ${id}`,
        result.rows
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  getSavedRecipeById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await savedRecipeModel.getSavedRecipeById(id);
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
  createSavedRecipe: async (req, res) => {
    try {
      let isNull;
      const { user_id, recipe_id } = req.body;

      const data = {
        id: uuidv4(),
        user_id,
        recipe_id,
      };

      Object.keys(data).forEach((e) => {
        if (!data[e]) isNull = e;
      });

      if (isNull) {
        return wrapper.response(res, 400, `${isNull} cannot be empty`, null);
      }

      const result = await savedRecipeModel.createSavedRecipe(data);
      return wrapper.response(res, 200, `Sucess create saved recipe`, result);
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  deleteSavedRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await savedRecipeModel.getSavedRecipeById(id);

      if (checkId.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      const result = await savedRecipeModel.deleteSavedRecipe(id);
      return wrapper.response(res, 200, `Success delete saved recipe id ${id}`);
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
};
