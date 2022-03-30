const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const authModel = require('../models/auth.model');
const { success, failed, successWithToken } = require('../helpers/response');
const wrapper = require('../helpers/wrapper');

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      const data = {
        id: uuidv4(),
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        phone,
      };

      const result = await authModel.register(data);
      return success(res, 200, `Success registered user`, result);
    } catch (error) {
      return failed(res, 400, `Bad Request : ${error.message}`);
    }
  },
  login: async (req, res) => {
    try {
      // const { email, password } = req.body;
      // authModel
      //   .getUserByEmail(email)
      //   .then((result) => {
      //     console.log(result);
      //     if (result.rowCount > 0) {
      //       bcrypt.compare(password, result.rows[0].password).then((match) => {
      //         if (match) {
      //           successWithToken(res, '1213242343', 'success', 'Login success');
      //         }
      //       });
      //     } else {
      //       return wrapper.response(res, 500, `email or password wrong`, null);
      //     }
      //   })
      //   .catch((err) =>
      //     wrapper.response(res, 400, `Bad Request : ${err.message}`, null)
      //   );

      const { email, password } = req.body;

      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.rows.length < 1) {
        return failed(res, 400, `Email or password wrong`);
      }

      const result = checkEmail.rows[0];
      const checkPassword = bcrypt.compareSync(password, result.password);
      if (!checkPassword) {
        return failed(res, 400, `Email or password wrong`);
      }

      return successWithToken(res, 200, `Login success`, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    } catch (error) {
      return failed(res, 400, `Bad Request : ${error.message}`);
    }
  },
};
