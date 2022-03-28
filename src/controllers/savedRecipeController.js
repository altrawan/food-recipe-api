const { v4: uuidv4 } = require('uuid');
const savedRecipeModel = require('../models/savedRecipeModel');
const wrapper = require('../helpers/wrapper');

module.exports = {
  getSavedRecipeByUser: async (req, res) => {
    try {
      const { id } = req.params;
      let { sort, sortType, page, limit } = req.query;
      sort = sort || 'saved_recipes.created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const totalData = await savedRecipeModel.getCountSavedRecipe(id);
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await savedRecipeModel.getSavedRecipeByUser(
        id,
        sort,
        sortType,
        limit,
        offset
      );

      if (result.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      if (page > totalPage) {
        return wrapper.response(res, 400, `Data only up to page ${totalPage}`);
      }

      return wrapper.response(
        res,
        200,
        `Success get saved recipe by id user ${id}`,
        result.rows,
        pageInfo
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  getSavedRecipeById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await savedRecipeModel.getSavedRecipeById(id);
      if (result.rows.length < 1) {
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
      return wrapper.response(
        res,
        200,
        `Success create saved recipe id ${data.id}`,
        result
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  deleteSavedRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await savedRecipeModel.getSavedRecipeById(id);

      if (checkId.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      const result = await savedRecipeModel.deleteSavedRecipe(id);
      return wrapper.response(res, 200, `Success delete like recipe id ${id}`);
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
};
