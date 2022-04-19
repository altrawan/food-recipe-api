const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { STMP_USER, STMP_PASS } = require('./env');
const { failed } = require('../helpers/response');

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: STMP_USER,
    pass: STMP_PASS,
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
      from: '"Mama Recipe App 🍕" <admin@mamarecipe.co.id>',
      to: email,
      subject: 'Please Confirm Your Account',
      text: 'Confirm Your email to Mama Recipe App Account',
      template: 'confirm-email',
      context: {
        name,
        url: `https://mama-recipe.herokuapp.com/auth/verify-email?token=${confirmationCode}`,
      },
    };

    transport.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },
};
