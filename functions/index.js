const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

// Sends an email confirmation when a contact form is submitted.
exports.newContactEmailNotification = functions.database.ref(`/contacts/{uid}`).onWrite(event => {
  const PTemail = "joegrotto@heir.company";
  const contact = event.data.val();
      const mailOptions = {
        from: '"Premier Admin" <noreply@firebase.com>',
        to: PTemail,
        subject: 'New Contact',
        text:
        `Name: ${contact.name} \
        Email: ${contact.email} \
        Phone: ${contact.phone} \
        Zipcode: ${contact.zipcode} \
        Message: ${contact.message}`
      };
    return mailTransport.sendMail(mailOptions).then(function() {
      console.log(`New contact email notification sent to: ${PTemail}`);
    });
});
