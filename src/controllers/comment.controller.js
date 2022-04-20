const { v4: uuidv4 } = require('uuid');
const commentModel = require('../models/comment.model');
const { success, failed } = require('../helpers/response');
// const redis = require('../config/redis');

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
        currentPage: page,
        dataPerPage: limit,
        totalPage,
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
        return failed(res, 404, 'failed', `Data not found`);
      }

      if (page > totalPage) {
        return failed(res, 400, 'failed', `Data only up to page ${totalPage}`);
      }

      // redis.setEx(
      //   `getComment:${JSON.stringify(req.query)}`,
      //   3600,
      //   JSON.stringify({ result, pageInfo })
      // );

      return success(
        res,
        200,
        'success',
        `Success get all data comments`,
        result.rows,
        pageInfo
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  getCommentById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await commentModel.getCommentById(id);

      if (result.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      // redis.setEx(`getComment:${id}`, 3600, JSON.stringify(result));

      return success(
        res,
        200,
        'success',
        `Success get data by id ${id}`,
        result.rows[0]
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  getCommentByRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await commentModel.getCommentByRecipe(id);

      // if (result.rows.length < 1) {
      //   return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      // }

      // redis.setEx(`getCommentByRecipe:${id}`, 3600, JSON.stringify(result));

      return success(
        res,
        200,
        'success',
        `Success get comment by recipe id ${id}`,
        result.rows
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  createComment: async (req, res) => {
    try {
      const { recipe_id, comment_text } = req.body;

      const data = {
        id: uuidv4(),
        user_id: req.APP_DATA.tokenDecoded.id,
        recipe_id,
        comment_text,
        is_active: 1,
      };

      const result = await commentModel.createComment(data);
      return success(
        res,
        200,
        'success',
        `Success create comment id ${data.id}`,
        result
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { comment_text } = req.body;

      const checkId = await commentModel.getDetailComment(id);
      if (checkId.rows.length < 1) {
        return success(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      const row = checkId.rows[0];
      if (req.APP_DATA.tokenDecoded.id !== row.user_id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      const data = {
        comment_text,
        updated_at: new Date(Date.now()),
      };

      const result = await commentModel.updateComment(data, id);
      return success(
        res,
        200,
        'success',
        `Success update comment id ${id}`,
        result
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await commentModel.getDetailComment(id);

      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`, null);
      }

      if (req.APP_DATA.tokenDecoded.id !== checkId.rows[0].user_id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      const result = await commentModel.deleteComment(id);
      return success(res, 200, 'success', `Success delete user id ${id}`);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
};
