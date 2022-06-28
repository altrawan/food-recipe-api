const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const { success, failed } = require('../helpers/response');
const jwtToken = require('../utils/generateJwtToken');
const authModel = require('../models/auth.model');
const userModel = require('../models/user.model');
const sendEmail = require('../utils/sendEmail');
const {
  APP_NAME,
  EMAIL_FROM,
  API_URL,
  APP_CLIENT,
  JWT_SECRET,
} = require('../helpers/env');
const activateAccount = require('../templates/confirm-email');
const verificationAccount = require('../templates/verfication-code');
const resetAccount = require('../templates/reset-password');
const deleteFile = require('../utils/deleteFile');
const uploadGoogleDrive = require('../utils/uploadGoogleDrive');

module.exports = {
  registeration: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      // check email already exist
      const checkEmail = await userModel.findBy('email', email);
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
      const checkPhone = await userModel.findBy('phone', phone);
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

      // upload image to google drive
      let photo = null;
      if (req.file) {
        // upload image to google drive
        const photoGd = await uploadGoogleDrive(req.file);
        photo = photoGd.id;
        // remove image after upload
        deleteFile(req.file.path);
      }
      // create verify token
      verifyToken = crypto.randomBytes(30).toString('hex');

      console.log(photo);

      // insert data to database
      const result = await authModel.register({
        id: uuidv4(),
        ...req.body,
        password: bcrypt.hashSync(password, 10),
        verifyToken,
        photo,
      });

      // send verification email
      const templateEmail = {
        from: `"${APP_NAME}" <${EMAIL_FROM}>`,
        to: email.toLowerCase(),
        subject: 'Activate Your Account!',
        html: activateAccount(`${API_URL}auth/activation/${verifyToken}`, name),
      };
      sendEmail(templateEmail);

      // response REST API success
      return success(res, {
        code: 201,
        message: 'Success Registered, please verification your email',
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
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;
      const checkToken = await userModel.findBy('verify_token', token);

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
          url_login: `${APP_CLIENT}auth/login`,
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
  loginAccount: async (req, res) => {
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
            const token = jwtToken(checkUser.rows[0]);
            // refresh token
            const payload = checkUser.rows[0];
            delete payload.password;
            const refreshToken = jwt.sign({ ...payload }, JWT_SECRET, {
              expiresIn: '24h',
            });
            // response REST API success with token
            return success(res, {
              code: 200,
              message: 'Login sucess',
              token: {
                id: payload.id,
                token,
                refreshToken,
              },
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
        // get code verification
        const nums = '0123456789';
        let verifyCode = '';
        for (let i = 0; i < 6; i++) {
          verifyCode += nums[Math.floor(Math.random() * nums.length)];
        }

        const result = await authModel.updateCode(
          Number(verifyCode),
          user.rows[0].id
        );

        // send email for reset password
        const templateEmail = {
          from: `"${APP_NAME}" <${EMAIL_FROM}>`,
          to: email.toLowerCase(),
          subject: 'Verification Code!',
          html: verificationAccount(
            `${APP_CLIENT}auth/code`,
            user.rows[0].name,
            verifyCode
          ),
        };
        sendEmail(templateEmail);

        return success(res, {
          code: 200,
          message: 'Code verification has been sent via email',
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
  verifyCode: async (req, res) => {
    try {
      const user = await userModel.findBy(
        'verify_code',
        Number(req.body.verifyCode)
      );

      if (user.rowCount) {
        const verifyToken = crypto.randomBytes(30).toString('hex');

        // send email for reset password
        const templateEmail = {
          from: `"${APP_NAME}" <${EMAIL_FROM}>`,
          to: user.rows[0].email,
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
          message: 'Code not found',
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
      const user = await userModel.findBy('verify_token', token);

      if (!user.rowCount) {
        return failed(res, {
          code: '401',
          message: 'Invalid token',
          error: 'Unauthorized',
        });
      }

      const password = await bcrypt.hash(req.body.password, 10);
      const result = await authModel.resetPassword(password, user.rows[0].id);

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
      redis.setex(`accessToken:${token}`, 3600 * 24, token);
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
      // check refresh token can be use
      redis.get(`refreshToken:${refreshToken}`, (error, result) => {
        if (!error && result !== null) {
          return failed(res, {
            code: 403,
            message: 'Your refresh token cannot be use',
            error: 'Forbidden',
          });
        }
        jwt.verify(refreshToken, JWT_SECRET, (error, result) => {
          if (error) {
            return helperWrapper.response(res, 403, error.message);
          }
          delete result.iat;
          delete result.exp;
          const token = jwt.sign(result, JWT_SECRET, {
            expiresIn: '1h',
          });
          const newRefreshToken = jwt.sign(result, JWT_SECRET, {
            expiresIn: '24h',
          });
          redis.setex(`refreshToken:${refreshToken}`, 3600 * 24, refreshToken);
          return success(res, {
            code: 200,
            message: 'Refresh Token Success !',
            token: {
              id: result.id,
              token,
              refreshToken: newRefreshToken,
            },
          });
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
