const { v4: uuidv4 } = require('uuid');
const recipeModel = require('../models/recipe.model');
const commentModel = require('../models/comment.model');
const { success, failed } = require('../helpers/response');
const pagination = require('../utils/pagination');
const deleteFile = require('../utils/deleteFile');
const uploadGoogleDrive = require('../utils/uploadGoogleDrive');
const deleteGoogleDrive = require('../utils/deleteGoogleDrive');
const redis = require('../config/redis');

module.exports = {
  list: async (req, res) => {
    try {
      let { field, search, sort, sortType, page, limit } = req.query;
      field = field || 'title';
      search = search || '';
      sort = sort || 'created_at';
      sortType = sortType || 'ASC';
      page = Number(page) || 1;
      limit = Number(limit) || 6;

      const offset = page * limit - limit;
      const count = await recipeModel.getCountRecipe();

      const result = await recipeModel.getAllRecipe(
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
          `getRecipe:${JSON.stringify(req.query)}`,
          3600,
          JSON.stringify({ result: result.rows, pagination: paging.response })
        );
        return success(res, {
          code: 200,
          message: `Success get data recipe`,
          data: result.rows,
          pagination: paging.response,
        });
      }

      // Pagination without search
      const paging = pagination(Number(count), page, limit);
      redis.setex(
        `getRecipe:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result: result.rows, pagination: paging.response })
      );
      return success(res, {
        code: 200,
        message: `Success get data recipe`,
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
  latest: async (req, res) => {
    try {
      let { limit } = req.query;
      limit = Number(limit) || 6;

      const result = await recipeModel.getLatestRecipe(limit);

      redis.setex(
        `getLatestRecipe:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify(result.rows)
      );

      return success(res, {
        code: 200,
        message: 'Success get latest recipe',
        data: result.rows,
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
      const recipe = await recipeModel.getRecipeById(id);

      if (!recipe.rowCount) {
        return failed(res, {
          code: 404,
          message: `Recipe with id ${id} not found`,
          error: 'Not Found',
        });
      }

      redis.setex(`getRecipe:${id}`, 3600, JSON.stringify(recipe.rows[0]));
      return success(res, {
        code: 200,
        message: 'Success get detail recipe',
        data: recipe.rows[0],
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  listComment: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await commentModel.getCommentByRecipe(id);

      redis.setex(`getRecipeComment:${id}`, 3600, JSON.stringify(comment.rows));

      return success(res, {
        code: 200,
        message: 'Success get list comment by recipe',
        data: comment.rows,
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
      let photo = null;
      if (req.file) {
        // upload image to google drive
        const photoGd = await uploadGoogleDrive(req.file);
        photo = photoGd.id;
        // remove image after upload
        deleteFile(req.file.path);
      }

      // create new object
      const data = {
        id: uuidv4(),
        userId: req.APP_DATA.tokenDecoded.id,
        photo,
        ...req.body,
      };

      // send object to model
      const result = await recipeModel.createRecipe(data);

      // response REST API success
      return success(res, {
        code: 200,
        message: 'Success create recipe',
        data: result,
      });
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.path);
      }
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
      const recipe = await recipeModel.getRecipeById(id);

      if (!recipe.rowCount) {
        if (req.file) {
          deleteFile(req.file.path);
        }

        return failed(res, {
          code: 404,
          message: `Recipe with ${id} not found`,
          error: 'Not Found',
        });
      }

      // upload image to google drive
      let { image } = recipe.rows[0];
      if (req.file) {
        if (image) {
          // remove old image except default image
          deleteGoogleDrive(image);
        }
        // upload new image to google drive
        const photoGd = await uploadGoogleDrive(req.file);
        image = photoGd.id;
        // remove image after upload
        deleteFile(req.file.path);
      }

      const data = {
        ...req.body,
        image,
      };

      const result = await recipeModel.updateRecipe(data, id);
      return success(res, {
        code: 200,
        message: 'Success edit recipe',
        data: result,
      });
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.path);
      }
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

      const recipe = await recipeModel.getRecipeById(id);
      if (!recipe.rowCount) {
        return failed(res, {
          code: 404,
          message: `Recipe with id ${id} not found !`,
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

      const result = await recipeModel.updateStatus(status, id);
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

      const recipe = await recipeModel.getRecipeById(id);
      if (!recipe.rowCount) {
        return failed(res, {
          code: 404,
          message: `Recipe with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      let { image } = recipe.rows[0];
      if (req.file) {
        if (image) {
          // remove old image google drive
          deleteGoogleDrive(image);
        }
      }

      await recipeModel.deleteRecipe(id);
      return success(res, {
        code: 200,
        message: 'Success delete recipe',
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
