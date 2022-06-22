const { v4: uuidv4 } = require('uuid');
const likedRecipeModel = require('../models/likedRecipe.model');
const { success, failed } = require('../helpers/response');
// const redis = require('../config/redis');

module.exports = {
  getAllLikedRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      let { key, search, sort, sortType, page, limit } = req.query;
      key = key || 'liked_recipes.id';
      search = search ? `%${search}%` : '%';
      sort = sort || 'liked_recipes.created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const totalData = await likedRecipeModel.getCountLikedRecipe();
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        currentPage: page,
        dataPerPage: limit,
        totalPage,
        totalData,
      };

      const result = await likedRecipeModel.getAllLikedRecipe(
        key,
        search,
        sort,
        sortType,
        limit,
        offset
      );

      if (result.rows.length < 1) {
        return failed(res, 404, 'failed', 'Data not found');
      }

      if (page > totalPage) {
        return failed(res, 400, 'failed', `Data only up to page ${totalPage}`);
      }

      // redis.setEx(
      //   `getLikedRecipe:${JSON.stringify(req.query)}`,
      //   3600,
      //   JSON.stringify({ result, pageInfo })
      // );

      return success(
        res,
        200,
        'success',
        'Success get all data liked recipes',
        result.rows,
        pageInfo
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  getLikedRecipeById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await likedRecipeModel.getLikedRecipeById(id);

      if (result.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      // redis.setEx(`getLikedRecipe:${id}`, 3600, JSON.stringify(result));

      return success(
        res,
        200,
        'success',
        `Success get liked recipe by id ${id}`,
        result.rows[0]
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  getLikedRecipeByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await likedRecipeModel.getLikedRecipeByUser(id);

      // if (result.rows.length < 1) {
      //   return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      // }

      // const checkId = await likedRecipeModel.getDetailLikedRecipeByUser(id);
      // if (req.APP_DATA.tokenDecoded.id !== checkId.rows[0].user_id) {
      //   return failed(res, 403, 'failed', `You don't have access to this page`);
      // }

      // redis.setEx(`getLikedRecipeByUser:${id}`, 3600, JSON.stringify(result));

      return success(
        res,
        200,
        'success',
        `Success get liked recipe by user id ${id}`,
        result.rows
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  createLikedRecipe: async (req, res) => {
    try {
      let isNull;
      const { recipe_id } = req.body;

      const data = {
        id: uuidv4(),
        user_id: req.APP_DATA.tokenDecoded.id,
        recipe_id,
      };

      Object.keys(data).forEach((e) => {
        if (!data[e]) isNull = e;
      });

      if (isNull) {
        return failed(res, 400, 'failed', `${isNull} cannot be empty`);
      }

      const result = await likedRecipeModel.createLikedRecipe(data);
      return success(
        res,
        200,
        'success',
        `Liked Recipe Added Successfully`,
        result
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  deleteLikedRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await likedRecipeModel.getDetailLikedRecipe(id);

      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      // if (req.APP_DATA.tokenDecoded.id !== checkId.rows[0].user_id) {
      //   return failed(res, 403, 'failed', `You don't have access to this page`);
      // }

      const result = await likedRecipeModel.deleteLikedRecipe(id);
      return success(res, 200, 'success', `Liked Recipe Deleted Successfully`);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
};
