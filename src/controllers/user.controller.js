const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const { success, failed } = require('../helpers/response');
const deleteFile = require('../helpers/deleteFile');
const redis = require('../config/redis');

module.exports = {
  // Retrieve all users from the database.
  getAllUsers: async (req, res) => {
    try {
      let { key, search, sort, sortType, page, limit } = req.query; //
      key = key || 'name';
      search = !search ? '%' : `%${search}%`;
      sort = sort || 'created_at';
      sortType = sortType || 'DESC';
      page = Number(page) || 1;
      limit = Number(limit) || 3;

      const offset = page * limit - limit;
      const totalData = await userModel.getCountUser();
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        currentPage: page,
        dataPerPage: limit,
        totalPage,
        totalData,
      };

      const result = await userModel.getAllUsers(
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
        `getUser:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

      return success(
        res,
        200,
        'success',
        'Success get all data users',
        result.rows,
        pageInfo
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  // Find a single user with an id
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await userModel.getUserById(id);

      if (result.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      redis.setEx(`getUser:${id}`, 3600, JSON.stringify(result));

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
  // Update a user by the id in the request
  updateProfile: async (req, res) => {
    try {
      const { id } = req.APP_DATA.tokenDecoded;
      const { name, email, phone } = req.body;

      // check user
      const checkId = await userModel.getDetailUser(id);
      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      const row = checkId.rows[0];
      // Only admin or user login
      if (req.APP_DATA.tokenDecoded.id !== row.id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      // validation email already exist
      const checkEmail = await userModel.getUserByEmail(email);
      if (email !== row.email && checkEmail.rowCount > 0) {
        return failed(res, 409, 'failed', `Email already exist`);
      }

      // validation phone already in use
      const checkPhone = await userModel.getUserByPhone(phone);
      if (phone !== row.phone && checkPhone.rowCount > 0) {
        return failed(res, 409, 'failed', `Phone number already in use`);
      }

      const data = {
        name,
        email,
        phone,
        updated_at: new Date(Date.now()),
      };

      const result = await userModel.updateProfile(data, id);
      return success(res, 200, 'success', `Success update profile`, result);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  updateImage: async (req, res) => {
    try {
      const { id } = req.APP_DATA.tokenDecoded;

      // check user
      const checkId = await userModel.getDetailUser(id);
      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      // Only admin or user login
      if (req.APP_DATA.tokenDecoded.id !== checkId.rows[0].id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      const data = {
        photo: req.file ? req.file.filename : null,
        updated_at: new Date(Date.now()),
      };

      const result = await userModel.updateImage(data, id);
      return success(
        res,
        200,
        'success',
        `Success update photo profile`,
        result
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { id } = req.APP_DATA.tokenDecoded;
      const { newPassword } = req.body;

      // check user
      const checkId = await userModel.getDetailUser(id);
      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      // Only admin or user login
      if (req.APP_DATA.tokenDecoded.id !== checkId.rows[0].id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      const data = {
        password: bcrypt.hashSync(newPassword, 10),
        updated_at: new Date(Date.now()),
      };

      const result = await userModel.updatePassword(data, id);
      return success(res, 200, 'success', `Change password success`, result);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await userModel.getDetailUser(id);

      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      if (checkId.rows[0].status === 0) {
        return failed(res, 409, 'failed', `User already not active`);
      }

      const result = await userModel.deleteUser(id);
      return success(res, 200, 'success', `Success delete user id ${id}`);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  // Delete a user with the specified id in the request
  deletePermanentUser: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await userModel.getDetailUser(id);

      if (checkId.rows.length < 1) {
        return failed(res, 404, 'failed', `Data by id ${id} not found !`);
      }

      // Only admin or user login
      if (req.APP_DATA.tokenDecoded.id !== checkId.rows[0].id) {
        return failed(res, 403, 'failed', `You don't have access to this page`);
      }

      const photo = checkId.rows[0].photo;
      if (photo) {
        deleteFile(`public/uploads/user/1648736734977.png`);
      }

      const result = await userModel.deletePermanentUser(id);
      return success(res, 200, 'success', `Success delete user id ${id}`);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
};
