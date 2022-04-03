const { v4: uuidv4 } = require('uuid');
const recipeModel = require('../models/recipe.model');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../helpers/deleteFile');
const redis = require('../config/redis');

module.exports = {
  getAllRecipes: async (req, res) => {
    try {
      let { key, search, sort, sortType, page, limit } = req.query;
      key = key || 'title';
      search = search ? `%${search}%` : '%';
      sort = sort || 'recipes.created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const totalData = await recipeModel.getCountRecipe();
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        currentPage: page,
        dataPerPage: limit,
        totalPage,
        totalData,
      };

      const result = await recipeModel.getAllRecipes(
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

      redis.setEx(
        `getRecipe:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

      return success(
        res,
        200,
        'success',
        'success get all data recipes',
        result.rows,
        pageInfo
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  getRecipeById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await recipeModel.getRecipeById(id);

      if (result.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      redis.setEx(`getRecipe:${id}`, 3600, JSON.stringify(result));

      return success(
        res,
        200,
        'success',
        `Success get recipe by id ${id}`,
        result.rows[0]
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  getRecipeByUser: async (req, res) => {
    try {
      let { id } = req.params;
      const result = await recipeModel.getRecipeByUser(id);

      if (result.rows.length < 1) {
        return failed(res, 404, `Data by user id ${id} not found !`);
      }

      const checkId = await recipeModel.getDetailRecipeByUser(id);
      
      const row = checkId.rows[0];
      if (req.APP_DATA.tokenDecoded.id !== row.user_id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      redis.setEx(`getRecipeByUser:${id}`, 3600, JSON.stringify(result));

      return success(
        res,
        200,
        'success',
        `Success get recipe by user id ${id}`,
        result.rows
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  createRecipe: async (req, res) => {
    try {
      // get data from req.body
      const { title, ingredients, video } = req.body;

      // create new object
      const data = {
        id: uuidv4(),
        title,
        image: req.file ? req.file.filename : null,
        ingredients,
        video: video ? video : null,
        status: 1,
        user_id: req.APP_DATA.tokenDecoded.id,
      };

      // send object to model
      const result = await recipeModel.createRecipe(data);

      // response REST API success
      return success(
        res,
        200,
        'success',
        `Success create recipe id ${data.id}`,
        result
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  updateRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, ingredients, video } = req.body;

      // check recipe
      const checkId = await recipeModel.getDetailRecipe(id);
      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      const row = checkId.rows[0];
      if (req.APP_DATA.tokenDecoded.id !== row.user_id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      const data = {
        title,
        image: req.file ? req.file.filename : null,
        ingredients,
        video: video ? video : null,
        updated_at: new Date(Date.now()),
      };

      const file = row.image;
      if (file) {
        deleteFile(`public/uploads/recipe/${file}`);
      }

      const result = await recipeModel.updateRecipe(data, id);

      return success(
        res,
        200,
        'success',
        `Success update recipe id ${id}`,
        result
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await recipeModel.getDetailRecipe(id);

      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      if (req.APP_DATA.tokenDecoded.id !== checkId.rows[0].user_id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      if (checkId.rows[0].status === 0) {
        return failed(res, 409, 'failed', `Recipe already not active`);
      }

      const result = await recipeModel.deleteUser(id);
      return success(res, 200, 'success', `Success delete recipe id ${id}`);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  deletePermanentRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await recipeModel.getDetailRecipe(id);

      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      if (req.APP_DATA.tokenDecoded.id !== checkId.rows[0].user_id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      const result = await recipeModel.deletePermanentRecipe(id);
      return success(res, 200, 'success', `Success delete recipe id ${id}`);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
};
