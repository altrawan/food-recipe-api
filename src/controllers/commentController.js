const { v4: uuidv4 } = require('uuid');
const commentModel = require('../models/commentModel');
const wrapper = require('../helpers/wrapper/wrapper');

module.exports = {
  getAllComments: async (req, res) => {
    try {
      let { key, search, sort, sortType, page, limit } = req.query;
      key = key || 'recipe_id';
      search = !search ? '%' : `%${search}%`;
      sort = sort || 'recipes.created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const totalData = await commentModel.getCountComment();
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await commentModel.getAllComments(
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
        `Success get all data comments`,
        result.rows,
        pageInfo
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  getCommentById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await commentModel.getCommentById(id);
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
  getCommentByRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await commentModel.getCommentByRecipe(id);
      if (result.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }
      return wrapper.response(
        res,
        200,
        `Success get data by id ${id}`,
        result.rows
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  createComment: async (req, res) => {
    try {
      let isNull;
      const { user_id, recipe_id, comment_text } = req.body;

      const data = {
        id: uuidv4(),
        user_id,
        recipe_id,
        comment_text,
      };

      Object.keys(data).forEach((e) => {
        if (!data[e]) isNull = e;
      });

      if (isNull) {
        return wrapper.response(res, 400, `${isNull} cannot be empty`, null);
      }

      const result = await commentModel.createComment(data);
      return wrapper.response(
        res,
        200,
        `Success create comment id ${data.id}`,
        result
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      let isNull;
      const checkId = await commentModel.getCommentById(id);

      if (checkId.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      const { user_id, recipe_id, comment_text } = req.body;
      const data = {
        user_id,
        recipe_id,
        comment_text,
        updated_at: new Date(Date.now()),
      };

      Object.keys(data).forEach((e) => {
        if (!data[e]) isNull = e;
      });

      if (isNull) {
        return wrapper.response(res, 400, `${isNull} cannot be empty`, null);
      }

      const result = await commentModel.updateComment(data, id);
      return wrapper.response(
        res,
        200,
        `Success update comment id ${id}`,
        result
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await commentModel.getCommentById(id);

      if (checkId.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      const result = await commentModel.deleteComment(id);
      return wrapper.response(res, 200, `Success delete user id ${id}`);
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
};
