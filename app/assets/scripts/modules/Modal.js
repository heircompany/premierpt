import $ from 'jquery';
import firebase from 'firebase';

class Modal {
  constructor() {
    // Shortcuts to DOM Elements.
    this.openModalButton = $(".open-modal");
    this.modal = $(".modal");
    this.closeModalButton = $(".modal__close");
    this.submitButtom = $("#contact-submit");
    this.state = {
      name: '',
      email: '',
      phone: '',
      zipcode: '',
      message: '',
    }
    this.events();
  }

  events() {
    // clicking the open modal button
    this.openModalButton.click(this.openModal.bind(this));

    // clicking the x close modal button
    this.closeModalButton.click(this.closeModal.bind(this));

    // clicking the submit form button
    this.submitButtom.click(this.closeModal.bind(this));

    // pushes any key
    $(document).keyup(this.keyPressHandler.bind(this));

    $(function() {
      // Initialize Firebase
        const config = {
          apiKey: "AIzaSyCkkO9ccuE89vMUqobTIw52EgJCu6-Wu-c",
          authDomain: "pt-nerve.firebaseapp.com",
          databaseURL: "https://pt-nerve.firebaseio.com",
          projectId: "pt-nerve",
          storageBucket: "pt-nerve.appspot.com",
          messagingSenderId: "844300527391"
        };
        firebase.initializeApp(config);
      // form submit
      $("#contact-form").on("submit", event => {
        event.preventDefault();
        const contact = {
          name: $("#contact-name").val() || state.name,
          email: $("#contact-email").val() || state.email,
          phone: $("#contact-phone").val() || state.phone,
          zipcode: $("#contact-zipcode").val() || state.zipcode,
          message: $("#contact-message").val() || state.message
        }
        this.newContact(contact);
        firebase.database().ref('contacts').push({ contact })
          .catch(error => {
            console.log(error);
          });
          $("#contact-form").trigger("reset");
      });
    }.bind(this));
  }

  newContact(contact) {
    // const SENDGRID_API_KEY = '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'
    const helper = require('sendgrid').mail;
    const from_email = new helper.Email("administrative@ptnerve.com");
    const to_email = new helper.Email("administrative@ptnerve.com");
    const subject = "New Contact";
    const content = new helper.Content("text/html", `<h2>New Contact Details:</h2><br>${contact}`);
    const mail = new helper.Mail(from_email, subject, to_email, content);

    const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
  }

  keyPressHandler(e) {
    if (e.keyCode == 27) {
      this.closeModal();
    }
  }

  openModal() {
    this.modal.addClass("modal--is-visible");
    return false;
  }

  closeModal() {
    this.modal.removeClass("modal--is-visible");
  }
}

export default Modal;
