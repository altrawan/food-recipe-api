const { v4: uuidv4 } = require('uuid');
const commentModel = require('../models/comment.model');
const { success, failed } = require('../helpers/response');
const pagination = require('../utils/pagination');
const redis = require('../config/redis');

module.exports = {
  list: async (req, res) => {
    try {
      let { field, search, sort, sortType, page, limit } = req.query;
      field = field || 'comment_text';
      search = search || '';
      sort = sort || 'created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const count = await commentModel.getCountComment();

      const result = await commentModel.getAllComment(
        field,
        search,
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

      // Pagination with search
      if (search) {
        const paging = pagination(result.rowCount, page, limit);
        redis.setex(
          `getComment:${JSON.stringify(req.query)}`,
          3600,
          JSON.stringify({ result: result.rows, pagination: paging.response })
        );
        return success(res, {
          code: 200,
          message: `Success get data comment`,
          data: result.rows,
          pagination: paging.response,
        });
      }

      // Pagination without search
      const paging = pagination(Number(count), page, limit);
      redis.setex(
        `getComment:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result: result.rows, pagination: paging.response })
      );
      return success(res, {
        code: 200,
        message: `Success get data comment`,
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
      const comment = await commentModel.getCommentById(id);

      if (!comment.rowCount) {
        return failed(res, {
          code: 404,
          message: `Comment with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      redis.setex(`getComment:${id}`, 3600, JSON.stringify(comment.rows[0]));

      return success(res, {
        code: 200,
        message: 'Success get detail comment',
        data: comment.rows[0],
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

      const result = await commentModel.createComment(data);

      return success(res, {
        code: 200,
        message: 'Success create comment',
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
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await commentModel.getCommentById(id);

      if (!comment.rowCount) {
        return failed(res, {
          code: 404,
          message: `Comment with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      const result = await commentModel.updateComment({ ...req.body }, id);
      return success(res, {
        code: 200,
        message: 'Success edit comment',
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
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const comment = await commentModel.getCommentById(id);
      if (!comment.rowCount) {
        return failed(res, {
          code: 404,
          message: `Comment with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      let status;
      if (isActive.toLowerCase() === 'active') {
        status = 1;
      } else if (isActive.toLowerCase() === 'deactive') {
        status = 0;
      } else {
        throw new Error("status only must be 'active' or 'deactive'");
      }

      const result = await commentModel.updateStatus(status, id);
      return success(res, {
        code: 200,
        message: `Success change status to ${isActive.toLowerCase()}`,
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

      const comment = await commentModel.getCommentById(id);

      if (!comment.rowCount) {
        failed(res, {
          code: 404,
          message: `Comment with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      await commentModel.deleteComment(id);
      return success(res, {
        code: 200,
        message: 'Success delete comment',
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
