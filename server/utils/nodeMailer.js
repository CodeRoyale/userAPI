const nodemailer = require('nodemailer');
const ejs = require('ejs');

const { MAIL } = process.env;
const { MAILPASS } = process.env;

// Creating transport instance
const transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: MAIL,
    pass: MAILPASS,
  },
};

// Creating a Nodemailer Transport instance
const transporter = nodemailer.createTransport(transport);

// Verifying the Nodemailer Transport instance
transporter.verify((error, success) => {
  if (error) {
    console.log('Node Mailer', error);
  } else {
    console.log('Node Mailer Success', success);
  }
});

const nodeMailer = async (firstName, email, url, next) => {
  ejs.renderFile(
    '/home/coming---soon/coming_soon/git/codeRoyale/codeRoyale-api/views/verifyTemplate.ejs',
    { name: firstName, url: url },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const mainOptions = {
          from: 'CodeRoyale coderoyale@coderoyale.com',
          to: email,
          subject: 'Account Activation',
          html: data,
        };
        // console.log("html data ======================>", mainOptions.html);

        /* eslint-disable */
        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            next();
            return;
          }
        });
        /* eslint-enable */
      }
    }
  );
};

module.exports = nodeMailer;
