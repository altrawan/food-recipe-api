const { v4: uuidv4 } = require('uuid');
const savedRecipeModel = require('../models/savedRecipe.model');
const { success, failed } = require('../helpers/response');
// const redis = require('../config/redis');

module.exports = {
  getAllSavedRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      let { key, search, sort, sortType, page, limit } = req.query;
      key = key || 'saved_recipes.id';
      search = search ? `%${search}%` : '%';
      sort = sort || 'saved_recipes.created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const totalData = await savedRecipeModel.getCountSavedRecipe();
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        currentPage: page,
        dataPerPage: limit,
        totalPage,
        totalData,
      };

      const result = await savedRecipeModel.getAllSavedRecipe(
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
      //   `getSavedRecipe:${JSON.stringify(req.query)}`,
      //   3600,
      //   JSON.stringify({ result, pageInfo })
      // );

      return success(
        res,
        200,
        'success',
        'Success get all data saved recipes',
        result.rows,
        pageInfo
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  getSavedRecipeById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await savedRecipeModel.getSavedRecipeById(id);

      if (result.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      // redis.setEx(`getSavedRecipe:${id}`, 3600, JSON.stringify(result));

      return success(
        res,
        200,
        'success',
        `Success get saved recipe by id ${id}`,
        result.rows[0]
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  getSavedRecipeByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await savedRecipeModel.getSavedRecipeByUser(id);

      if (result.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      if (req.APP_DATA.tokenDecoded.id !== row.user_id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      // redis.setEx(`getSavedRecipeByUser:${id}`, 3600, JSON.stringify(result));

      return success(
        res,
        200,
        'success',
        `Success get saved recipe by user id ${id}`,
        result.rows
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  createSavedRecipe: async (req, res) => {
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

      const result = await savedRecipeModel.createSavedRecipe(data);
      return success(
        res,
        200,
        'success',
        `Saved Recipe Added Successfully`,
        result
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  deleteSavedRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await savedRecipeModel.getSavedRecipeById(id);

      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      if (req.APP_DATA.tokenDecoded.id !== checkId.rows[0].user_id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      const result = await savedRecipeModel.deleteSavedRecipe(id);
      return success(res, 200, 'success', `Saved Recipe Deleted Successfully`);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
};
