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
      const { token } = req.params;
      const checkToken = await userModel.findBy('token', token);

      if (checkToken.rowCount) {
        if (!checkToken.rowCount) {
          res.send(`
          <div>
            <h1>Activation Failed</h1>
            <h3>Token invalid</h3>
          </div>`);
          return;
        }

        await authModel.activateEmail(token);
        res.render('./welcome.ejs', {
          email: checkToken.rows[0].email,
          url_home: `${APP_CLIENT}`,
          url_login: `${APP_CLIENT}/auth/login`,
        });
      } else {
        failed(res, {
          code: 404,
          message: 'Token not found',
          error: 'Not Found',
        });
      }
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
      const checkUser = await userModel.findBy('email', email);

      if (checkUser.rowCount > 0) {
        if (checkUser.rows[0].is_active) {
          // compare password from req.body and password from db
          const match = await bcrypt.compare(
            password,
            checkUser.rows[0].password
          );
          if (match) {
            // generate dynamic token using jwt
            const jwt = jwtToken(checkUser.rows[0]);
            // response REST API success with token
            return success(res, {
              code: 200,
              message: 'Login sucess',
              token: jwt,
            });
          } else {
            // validation password doesn't match
            return failed(res, {
              code: 401,
              message: 'Wrong email or password',
              error: 'Unauthorized',
            });
          }
        } else {
          return failed(res, {
            code: 403,
            message: 'Your account has been banned',
            error: 'Forbidden',
          });
        }
      } else {
        // validation email doesn't exist
        return failed(res, {
          code: 401,
          message: 'Wrong email or password',
          error: 'Unauthorized',
        });
      }
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userModel.findBy('email', email);
      if (user.rowCount) {
        const verifyToken = crypto.randomBytes(30).toString('hex');

        // send email for reset password
        const templateEmail = {
          from: `"${APP_NAME}" <${EMAIL_FROM}>`,
          to: req.body.email.toLowerCase(),
          subject: 'Reset Your Password!',
          html: resetAccount(`${APP_CLIENT}auth/reset/${verifyToken}`),
        };
        sendEmail(templateEmail);

        const result = await authModel.updateToken(
          verifyToken,
          user.rows[0].id
        );
        return success(res, {
          code: 200,
          message: 'Password reset has been sent via email',
          data: result,
        });
      } else {
        return failed(res, {
          code: 404,
          message: 'Email not found',
          error: 'Not Found',
        });
      }
    } catch (error) {
      return failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await userModel.findBy('token', token);

      if (!user.rowCount) {
        return failed(res, {
          code: '401',
          message: 'Invalid token',
          error: 'Unauthorized',
        });
      }

      const password = await bcrypt.hash(req.body.password, 10);
      const result = await authModel.updatePassword(password, user.rows[0].id);

      return success(res, {
        code: 200,
        message: 'Reset Password Success',
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
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.split(' ')[1];
      const result = await redis.get(`accessToken:${token}`);
      if (result) {
        return (
          res,
          {
            code: 403,
            message: 'Your token is destroyed please login again',
            error: 'Forbidden',
          }
        );
      }
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      return success(res, {
        code: 200,
        message: 'Sucess logout',
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
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const check = await redis.get(`refreshToken:${refreshToken}`);
      if (check) {
        return failed(res, {
          code: 403,
          message: 'Your resfresh token cannot be use',
          error: 'Forbidden',
        });
      }
      jwt.verify(refreshToken, JWT_SECRET, (error, result) => {
        if (error) {
          return failed(res, {
            code: 403,
            message: error.message,
            error: 'Forbidden',
          });
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
        return success(res, {
          code: 200,
          message: 'Success get refresh token',
          token: {
            id: result.id,
            token,
            refreshToken: newRefreshToken,
          },
        });
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
