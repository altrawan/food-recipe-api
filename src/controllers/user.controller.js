const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const recipeModel = require('../models/recipe.model');
const likedRecipeModel = require('../models/likedRecipe.model');
const savedRecipeModel = require('../models/savedRecipe.model');
const { success, failed } = require('../helpers/response');
const pagination = require('../utils/pagination');
const deleteFile = require('../utils/deleteFile');
const uploadGoogleDrive = require('../utils/uploadGoogleDrive');
const deleteGoogleDrive = require('../utils/deleteGoogleDrive');
const redis = require('../config/redis');

module.exports = {
  // Retrieve all users from the database.
  list: async (req, res) => {
    try {
      let { field, search, sort, sortType, page, limit } = req.query;
      field = field || 'name';
      search = search || '';
      sort = sort || 'created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const count = await userModel.getCountUser();

      const result = await userModel.getAllUser(
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
          `getUser:${JSON.stringify(req.query)}`,
          3600,
          JSON.stringify({ result: result.rows, pagination: paging.response })
        );
        return success(res, {
          code: 200,
          message: `Success get data user`,
          data: result.rows,
          pagination: paging.response,
        });
      }

      // Pagination without search
      const paging = pagination(Number(count), page, limit);
      redis.setex(
        `getUser:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result: result.rows, pagination: paging.response })
      );
      return success(res, {
        code: 200,
        message: `Success get data user`,
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
  // Find a single user with an id
  detail: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.findBy('id', id);

      if (!user.rowCount) {
        failed(res, {
          code: 404,
          message: `User with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      redis.setex(`getUser:${id}`, 3600, JSON.stringify(user.rows[0]));

      return success(res, {
        code: 200,
        message: 'Success get detail user',
        data: user.rows[0],
      });
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  listRecipe: async (req, res) => {
    try {
      let { id } = req.params;

      const user = await userModel.findBy('id', id);
      // if user not exist
      if (!user.rowCount) {
        return failed(res, {
          code: 404,
          message: `User with id ${id} not found`,
          error: 'Not Found',
        });
      }

      const result = await recipeModel.getRecipeByUser(id);
      redis.setex(`getUserRecipe:${id}`, 3600, JSON.stringify(result.rows));
      return success(res, {
        code: 200,
        message: 'Success get recipe user',
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
  listLikedRecipe: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await userModel.findBy('id', id);
      // if user not exist
      if (!user.rowCount) {
        return failed(res, {
          code: 404,
          message: `User with id ${id} not found`,
          error: 'Not Found',
        });
      }

      const result = await likedRecipeModel.findBy('liked_recipes.user_id', id);

      redis.setex(
        `getLikedRecipeUser:${id}`,
        3600,
        JSON.stringify(result.rows)
      );

      return success(res, {
        code: 200,
        message: 'Success get liked recipe user',
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
  listSavedRecipe: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await userModel.findBy('id', id);
      // if user not exist
      if (!user.rowCount) {
        return failed(res, {
          code: 404,
          message: `User with id ${id} not found`,
          error: 'Not Found',
        });
      }

      const result = await savedRecipeModel.findBy('saved_recipes.user_id', id);

      redis.setex(
        `getSavedRecipeUser:${id}`,
        3600,
        JSON.stringify(result.rows)
      );

      return success(res, {
        code: 200,
        message: 'Success get saved recipe user',
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
  // // Update a user by the id in the request
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;

      const user = await userModel.findBy('id', id);
      // if user not exist
      if (!user.rowCount) {
        return failed(res, {
          code: 404,
          message: `User with id ${id} not found`,
          error: 'Not Found',
        });
      }

      // validation email already in use
      const checkEmail = await userModel.findBy('email', email);
      if (email !== user.rows[0].email && checkEmail.rowCount) {
        return failed(res, {
          code: 409,
          message: 'Email already in use',
          error: 'Conflict',
        });
      }

      // validation phone already in use
      const checkPhone = await userModel.findBy('phone', phone);
      if (phone !== user.rows[0].phone && checkPhone.rowCount) {
        return failed(res, {
          code: 409,
          message: 'Phone number already in use',
          error: 'Conflict',
        });
      }

      const data = {
        name,
        email,
        phone,
        updated_at: new Date(Date.now()),
      };

      const result = await userModel.updateProfile(data, id);
      return success(res, {
        code: 200,
        message: 'Success edit profile',
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
  updatePhoto: async (req, res) => {
    try {
      const { id } = req.params;

      // check user
      const user = await userModel.findBy('id', id);
      if (!user.rowCount) {
        if (req.file) {
          deleteFile(req.file.path);
        }
        return failed(res, {
          code: 404,
          message: `User with id ${id} not found`,
          error: 'Not Found',
        });
      }

      // upload image to google drive
      let { photo } = user.rows[0];
      if (req.file) {
        if (photo) {
          // remove old image except default image
          deleteGoogleDrive(photo);
        }
        // upload new image to google drive
        const photoGd = await uploadGoogleDrive(req.file);
        photo = photoGd.id;
        // remove image after upload
        deleteFile(req.file.path);
      }

      const data = {
        photo,
        updated_at: new Date(Date.now()),
      };

      const result = await userModel.updatePhoto(data, id);
      return success(res, {
        code: 200,
        message: 'Success update photo profile',
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
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      // check user
      const user = await userModel.findBy('id', id);
      if (!user.rowCount) {
        return failed(res, {
          code: 404,
          message: `User with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      const data = {
        password: bcrypt.hashSync(password, 10),
        updated_at: new Date(Date.now()),
      };

      const result = await userModel.updatePassword(data, id);
      return success(res, {
        code: 200,
        message: 'Change password success',
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

      const user = await userModel.findBy('id', id);
      if (!user.rowCount) {
        return failed(res, {
          code: 404,
          message: `User with id ${id} not found !`,
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

      const result = await userModel.updateStatus(status, id);
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
  // Delete a user with the specified id in the request
  destroy: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await userModel.findBy('id', id);
      if (!user.rowCount) {
        return failed(res, {
          code: 404,
          message: `User with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      let { photo } = user.rows[0];
      if (req.file) {
        if (photo) {
          deleteGoogleDrive(photo);
        }
      }

      await userModel.deleteUser(id);
      return success(res, {
        code: 200,
        message: 'Success delete user',
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
