const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator/check');
const recipeModel = require('../models/recipeModel');
const wrapper = require('../helpers/wrapper/wrapper');

module.exports = {
  getAllRecipes: async (req, res) => {
    try {
      let { key, search, sort, sortType, page, limit } = req.query;
      key = key || 'title';
      search = !search ? '%' : `%${search}%`;
      sort = sort || 'created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const totalData = await recipeModel.getCountRecipe();
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
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
        return wrapper.response(res, 404, 'Data not found', null);
      }

      if (page > totalPage) {
        return wrapper.response(res, 400, `Data only up to page ${totalPage}`);
      }

      return wrapper.response(
        res,
        200,
        'success get all data recipes',
        result.rows,
        pageInfo
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  getRecipeById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await recipeModel.getRecipeById(id);

      if (result.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      return wrapper.response(
        res,
        200,
        `Success get recipe by id ${id}`,
        result.rows[0]
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  getRecipeByName: async (req, res) => {
    try {
      const { key } = req.query;
      const result = await recipeModel.getRecipeByName(key);

      if (result.rows.length < 1) {
        return wrapper.response(
          res,
          404,
          `Data by name ${key} not found !`,
          null
        );
      }

      return wrapper.response(
        res,
        200,
        `Success get recipe by name ${key}`,
        result.rows
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  getLatestRecipe: async (req, res) => {
    try {
      let { limit } = req.query;
      limit = Number(limit) || 5;
      const result = await recipeModel.getLatestRecipe(limit);

      return wrapper.response(
        res,
        200,
        `Success get latest recipe`,
        result.rows
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  getRecipeByUser: async (req, res) => {
    try {
      let { id } = req.params;
      const result = await recipeModel.getRecipeByUser(id);

      if (result.rows.length < 1) {
        return wrapper.response(
          res,
          404,
          `Data by user id ${id} not found !`,
          null
        );
      }

      return wrapper.response(
        res,
        200,
        `Success get recipe by user id ${id}`,
        result.rows
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  createRecipe: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      let isNull;
      const { title, image, ingredients, video, user_id } = req.body;

      const data = {
        id: uuidv4(),
        title,
        image: image ? image : '-',
        ingredients,
        video: video ? video : '-',
        user_id,
      };

      Object.keys(data).forEach((e) => {
        if (!data[e]) isNull = e;
      });

      if (isNull) {
        return wrapper.response(res, 400, `${isNull} cannot be empty`, null);
      }

      const result = await recipeModel.createRecipe(data);
      return wrapper.response(
        res,
        200,
        `Success create recipe id ${data.id}`,
        result
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  updateRecipe: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      let isNull;
      const checkId = await recipeModel.getRecipeById(id);

      if (checkId.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      const { title, image, ingredients, video, user_id } = req.body;

      // validate if data same
      const row = checkId.rows[0];
      if (
        title === row.title &&
        image === row.image &&
        ingredients === row.ingredients &&
        video === row.video &&
        user_id === row.user_id
      ) {
        return wrapper.response(res, 400, `Data cannot be same`, null);
      }

      const data = {
        title,
        image: image ? image : '-',
        ingredients,
        video: video ? video : '-',
        user_id,
        updated_at: new Date(Date.now()),
      };

      Object.keys(data).forEach((e) => {
        if (!data[e]) isNull = e;
      });

      if (isNull) {
        return wrapper.response(res, 400, `${isNull} cannot be empty`, null);
      }

      const result = await recipeModel.updateRecipe(data, id);
      return wrapper.response(
        res,
        200,
        `Success update recipe id ${id}`,
        result
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await recipeModel.getRecipeById(id);

      if (checkId.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      const result = await recipeModel.deleteRecipe(id);
      return wrapper.response(res, 200, `Success delete recipe id ${id}`);
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
};
