const { v4: uuidv4 } = require('uuid');
const savedRecipeModel = require('../models/savedRecipe.model');
const { success, failed } = require('../helpers/response');
const pagination = require('../utils/pagination');
const redis = require('../config/redis');

module.exports = {
  list: async (req, res) => {
    try {
      let { sort, sortType, page, limit } = req.query;
      sort = sort || 'created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const count = await savedRecipeModel.getCountSavedRecipe();

      const result = await savedRecipeModel.getAllSavedRecipe(
        sort,
        sortType,
        limit,
        offset,
        req.APP_DATA.tokenDecoded.level
      );

      if (!result.rowCount) {
        return failed(res, {
          code: 404,
          message: 'Data not found',
          error: 'Not Found',
        });
      }

      // Pagination without search
      const paging = pagination(Number(count), page, limit);
      redis.setex(
        `getSavedRecipe:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result: result.rows, pagination: paging.response })
      );
      return success(res, {
        code: 200,
        message: `Success get data saved recipe`,
        data: result.rows,
        pagination: paging.response,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params;
      const saved = await savedRecipeModel.findBy('saved_recipes.id', id);

      if (!saved.rowCount) {
        failed(res, {
          code: 404,
          message: `saved Recipe with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      redis.setex(`getSavedRecipe:${id}`, 3600, JSON.stringify(saved.rows[0]));

      return success(res, {
        code: 200,
        message: 'Success get detail saved recipe',
        data: saved.rows[0],
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  store: async (req, res) => {
    try {
      const data = {
        id: uuidv4(),
        userId: req.APP_DATA.tokenDecoded.id,
        ...req.body,
      };

      const result = await savedRecipeModel.createSavedRecipe(data);

      return success(res, {
        code: 200,
        message: 'Success create saved recipe',
        data: result,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  destroy: async (req, res) => {
    try {
      const { id } = req.params;

      const saved = await savedRecipeModel.findBy('saved_recipes.id', id);

      if (!saved.rowCount) {
        failed(res, {
          code: 404,
          message: `saved Recipe with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      await savedRecipeModel.deleteSavedRecipe(id);
      return success(res, {
        code: 200,
        message: 'Success delete saved recipe',
        data: null,
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
