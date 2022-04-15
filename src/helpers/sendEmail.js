const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { PORT, STMP_SERVICE, STMP_USER, STMP_PASS } = require('./env');
const { failed } = require('../helpers/response');

const transport = nodemailer.createTransport({
  service: STMP_SERVICE,
  auth: {
    user: STMP_USER,
    pass: STMP_PASS, // naturally, replace both with your real credentials or an application-specific password
  },
});

module.exports = {
  sendConfirmationEmail: (name, email, confirmationCode) => {
    transport.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.html',
          partialsDir: path.resolve('./src/template/email'),
          defaultLayout: false,
        },
        viewPath: path.resolve('./src/template/email'),
        extName: '.html',
      })
    );

    const mailOptions = {
      from: '"Pijarfood App 🍕" <admin@pijarfood.com>',
      to: email,
      subject: 'Please Confirm Your Account',
      text: 'Confirm Your email to Pijarfood App Account',
      template: 'confirm-email',
      context: {
        name,
        url: `http://localhost:${PORT}/auth/verify-email?token=${confirmationCode}`,
      },
    };
 
    transport.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },
};
