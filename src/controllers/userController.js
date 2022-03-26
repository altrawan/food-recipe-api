const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const wrapper = require('../helpers/wrapper/wrapper');

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      let { key, search, sort, sortType, page, limit } = req.query;
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
        page,
        totalPage,
        limit,
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
        return wrapper.response(res, 404, 'Data not found', null);
      }

      if (page > totalPage) {
        return wrapper.response(res, 400, `Data only up to page ${totalPage}`);
      }

      return wrapper.response(
        res,
        200,
        'Success get all data users',
        result.rows,
        pageInfo
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await userModel.getUserById(id);
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
  createUser: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      let isNull;
      const { name, email, password, phone, photo } = req.body;

      // CHECK EMAIL ALREADY EXIST
      const checkEmail = await userModel.getEmailAllUsers(email);

      if (checkEmail.rows.length > 0) {
        return wrapper.response(res, 400, `Email ${email} already exists !`, null);
      }

      const data = {
        id: uuidv4(),
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        phone,
        photo: photo ? photo : '-',
      };

      Object.keys(data).forEach((e) => {
        if (!data[e]) isNull = e;
      });

      if (isNull) {
        return wrapper.response(res, 400, `${isNull} cannot be empty`, null);
      }

      const result = await userModel.createUser(data);
      return wrapper.response(
        res,
        200,
        `Success create user id ${data.id}`,
        result
      );
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  updateUser: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      let isNull;
      const checkId = await userModel.getUserById(id);

      if (checkId.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      const { name, email, password, phone, photo } = req.body;

      // validate if data same
      const row = checkId.rows[0];
      if (
        name === row.name &&
        email === row.email &&
        password === row.password &&
        phone === row.phone &&
        photo === row.photo
      ) {
        return wrapper.response(res, 400, `Data cannot be same`, null);
      }

      // CHECK EMAIL ALREADY EXIST
      const checkEmail = await userModel.getEmailAllUsers(email);

      if (checkEmail.rows.length > 0) {
        return wrapper.response(res, 400, `Email ${email} already exists !`, null);
      }

      const data = {
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        phone,
        photo: photo ? photo : '-',
        updated_at: new Date(Date.now()),
      };

      Object.keys(data).forEach((e) => {
        if (!data[e]) isNull = e;
      });

      if (isNull) {
        return wrapper.response(res, 400, `${isNull} cannot be empty`, null);
      }

      const result = await userModel.updateUser(data, id);
      return wrapper.response(res, 200, `Success update user id ${id}`, result);
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await userModel.getUserById(id);

      if (checkId.rows.length < 1) {
        return wrapper.response(res, 404, `Data by id ${id} not found !`, null);
      }

      const result = await userModel.deleteUser(id);
      return wrapper.response(res, 200, `Success delete user id ${id}`);
    } catch (error) {
      return wrapper.response(res, 400, `Bad Request : ${error.message}`, null);
    }
  },
};
