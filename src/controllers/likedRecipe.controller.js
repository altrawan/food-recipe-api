const { v4: uuidv4 } = require('uuid');
const likedRecipeModel = require('../models/likedRecipe.model');
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
      const count = await likedRecipeModel.getCountLikedRecipe();

      const result = await likedRecipeModel.getAllLikedRecipe(
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
        `getLikedRecipe:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result: result.rows, pagination: paging.response })
      );
      return success(res, {
        code: 200,
        message: `Success get data liked recipe`,
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
      const liked = await likedRecipeModel.findBy('liked_recipes.id', id);

      if (!liked.rowCount) {
        failed(res, {
          code: 404,
          message: `Liked Recipe with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      redis.setex(`getLikedRecipe:${id}`, 3600, JSON.stringify(liked.rows[0]));

      return success(res, {
        code: 200,
        message: 'Success get detail liked recipe',
        data: liked.rows[0],
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

      const result = await likedRecipeModel.createLikedRecipe(data);

      return success(res, {
        code: 200,
        message: 'Success create liked recipe',
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

      const liked = await likedRecipeModel.findBy('liked_recipes.id', id);

      if (!liked.rowCount) {
        failed(res, {
          code: 404,
          message: `Liked Recipe with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      await likedRecipeModel.deleteLikedRecipe(id);
      return success(res, {
        code: 200,
        message: 'Success delete liked recipe',
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
