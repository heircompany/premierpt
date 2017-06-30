import $ from 'jquery';
import firebase from 'firebase';

class Modal {
  constructor() {
    // Shortcuts to DOM Elements.
    this.openModalButton = $(".open-modal");
    this.modal = $(".modal");
    this.closeModalButton = $(".modal__close");
    this.name = $("#contact-name");
    this.email = $("#contact-email");
    this.phone = $("#contact-phone");
    this.zipcode = $("#contact-zipcode");
    // this.message = $("#contact-message").val();

    this.submitButton = $("#contact-submit");
    this.state = {
      name: '',
      email: '',
      phone: '',
      zipcode: ''
    }
    this.events();
  }

  events() {
    // clicking the open modal button
    this.openModalButton.click(this.openModal.bind(this));

    // clicking the x close modal button
    this.closeModalButton.click(this.closeModal.bind(this));

    // clicking the submit form button
    this.submitButton.click(this.closeModal.bind(this));

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
          name: this.name.val(),
          email: this.email.val(),
          phone: this.phone.val(),
          zipcode: this.zipcode.val()
        }
        firebase.database().ref('contacts').push({ contact })
          .catch(error => {
            console.log(error);
          });
          $("#contact-form").trigger("reset");
      });
    }.bind(this));
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
