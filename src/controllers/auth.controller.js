const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const authModel = require('../models/auth.model');
const { success, failed, successWithToken } = require('../helpers/response');
const jwtToken = require('../helpers/generateToken');
const sendEmail = require('../helpers/sendEmail');
const randomToken = require('../helpers/randomToken');
const redis = require('../config/redis');
// TOKEN
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../helpers/env');

module.exports = {
  register: async (req, res) => {
    try {
      // get name, email, password and phone from req.body
      const { name, email, password, phone } = req.body;

      // create new object
      const data = {
        id: uuidv4(),
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        phone,
        level: 1,
        is_active: 0,
        token: randomToken,
      };

      // send object to model
      const result = await authModel.register(data);
      sendEmail.sendConfirmationEmail(name, email, randomToken);

      // response REST API success
      return success(
        res,
        200,
        'success',
        `User was registered successfully! Plaese check your email`,
        result
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;
      const checkToken = await authModel.getUserByToken(token);

      if (checkToken.rows.length < 1) {
        return failed(res, 403, 'failed', `Invalid token !`);
      }

      if (checkToken.rows[0].is_active === 1) {
        return failed(res, 409, 'failed', `User already registered`);
      }

      const result = await authModel.verifyEmail(token);

      return success(
        res,
        200,
        'success',
        `Success activated user`,
        checkToken.rows[0]
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  login: async (req, res) => {
    try {
      // get email and password from body
      const { email, password } = req.body;

      // check email address
      const checkEmail = await authModel.getUserByEmail(email);

      // validation email doesn't exist
      if (checkEmail.rows.length < 1) {
        return failed(res, 400, `Email or password wrong`);
      }

      // check password
      const result = checkEmail.rows[0];

      // compare password from req.body and password from db
      const checkPassword = bcrypt.compareSync(password, result.password);

      // validation password doesn't match
      if (!checkPassword) {
        return failed(res, 400, 'failed', `Email or password wrong`);
      }

      if (result.is_active !== 1) {
        return failed(
          res,
          401,
          'failed',
          'Account is not active. Please Contact Administrator'
        );
      }

      // generate dynamic token using jwt
      const token = jwtToken(result);

      // response REST API success with token
      return successWithToken(res, 200, 'success', `Login success`, token);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.split(' ')[1];

      const result = await redis.get(`accessToken:${token}`);
      if (result) {
        return failed(
          res,
          403,
          'failed',
          `Your token is destroyed please login again`
        );
      }

      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      return success(res, 200, 'success', `Success logout`);
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      const check = await redis.get(`refreshToken:${refreshToken}`);
      if (check) {
        return failed(res, 403, 'failed', `Your refresh token cannot be use`);
      }

      jwt.verify(refreshToken, JWT_SECRET, (error, result) => {
        if (error) {
          return failed(res, 403, 'failed', error.message);
        }

        delete result.iat;
        delete result.exp;

        const token = jwt.sign(result, JWT_SECRET, {
          expiresIn: '1h',
        });

        const newRefreshToken = jwt.sign(result, JWT_SECRET, {
          expiresIn: '24h',
        });

        redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, refreshToken);

        return successWithToken(
          res,
          200,
          'success',
          'Success Refresh Token !',
          {
            id: result.id,
            token,
            refreshToken: newRefreshToken,
          }
        );
      });
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
};
