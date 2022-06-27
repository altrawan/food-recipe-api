const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { success, failed } = require('../helpers/response');
const jwtToken = require('../utils/generateJwtToken');
const authModel = require('../models/auth.model');
const sendEmail = require('../utils/sendEmail');
const { APP_NAME, EMAIL_FROM, API_URL, APP_CLIENT } = require('../helpers/env');
const activateAccount = require('../templates/confirm-email');
const resetAccount = require('../templates/reset-password');
const redis = require('../config/redis');

module.exports = {
  register: async (req, res) => {
    try {
      // check email already exist
      const checkEmail = await UserModel.findBy('email', email);
      if (checkEmail.rowCount > 0) {
        if (req.files) {
          if (req.files.photo) {
            deleteFile(req.files.photo[0].path);
          }
        }
        return failed(res, {
          code: 409,
          message: 'Email already exist',
          error: 'Conflict',
        });
      }

      // check phone number already exists
      const checkPhone = await UserModel.findBy('phone', phone);
      if (checkPhone.rowCount > 0) {
        if (req.files) {
          if (req.files.photo) {
            deleteFile(req.files.photo[0].path);
          }
        }
        return failed(res, {
          code: 409,
          message: 'Phone Number already exist',
          error: 'Conflict',
        });
      }

      let photo = null;
      if (req.files) {
        if (req.files.photo) {
          photo = req.files.photo[0].filename;
        }
      }

      // insert data to database
      const result = await authModel.register({
        id: uuidv4(),
        ...req.body,
        password: bcrypt.hashSync(password, 10),
        verifyToken: crypto.randomBytes(30).toString('hex'),
        photo,
      });

      // send verification email
      const templateEmail = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: req.body.email.toLowerCase(),
        subject: 'Activate Your Account!',
        html: activateAccount(`${API_URL}auth/activation/${token}`, name),
      };
      sendEmail(templateEmail);

      // response REST API success
      return success(res, {
        code: 201,
        message: 'Success Registered, please verification your email',
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
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      const checkToken = await authModel.getUserByToken(token);

      if (checkToken.rows.length < 1) {
        return failed(res, 403, 'failed', `Invalid token !`);
      }

      if (checkToken.rows[0].is_active === 1) {
        return failed(res, 409, 'failed', `User already registered`);
      }

      await authModel.verifyEmail(token);

      // ejs.renderFile(path.resolve("./src/views/welcome.ejs"), {
      //   user_firstname: checkToken.rows[0].name,
      //   confirm_link: 'http://localhost:3000/login',
      // });

      return success(res, 200, 'success', `Success activated user`);
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
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
        return failed(res, 400, 'failed', `Email or password wrong`);
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
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
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
