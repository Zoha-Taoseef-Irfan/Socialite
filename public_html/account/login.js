/*
Authors: Amimul Ehsan Zoha, Taoseef Aziz, Irfan Ahmad
Course: CS337 Spring 2023
Project: Socialite Social Media

Description:
This code is a JavaScript function that handles the login process for a web application. 
It is designed to be used in conjunction with a login form that contains two input fields: one for the username and one for the password.
The login function retrieves the values of the username and password input fields using jQuery, and then makes an AJAX GET request to the server using the jQuery $.get() method. 
The request URL includes the username and password as parameters, which are encoded using the encodeURIComponent() method.
The first code block defines a CustomSessions class with methods to manage user sessions in a web application. 
It keeps track of active sessions and automatically cleans up expired sessions.
The second code block defines a login() function that handles a user login request by sending a GET request to the server with the user's credentials. 
If the login is successful, it redirects the user to the app's index page.
The third code block uses jQuery to handle the submission of a file upload form. 
It creates a FormData object containing the form data, appends an extra field, disables the submit button, and sends a POST request to the server. It displays the response message in the page and re-enables the submit button.
*/

function login() {
  let u = $('#usernameLogin').val();
  let p = $('#passwordLogin').val();
  $.get(
    '/account/login/' + u + '/' + encodeURIComponent(p),
    (data, status) => {
      console.log(data);
        alert(data);
        if (data === 'SUCCESS') {
          window.location.href = '/app/index.html';
        }
  });
}
$(document).ready(function () {

  $("#btnSubmit").click(function (event) {

      //stop submit the form, we will post it manually.
      event.preventDefault();

      // Get form
      var form = $('#fileUploadForm')[0];

  // Create a FormData object 
      var data = new FormData(form);
      console.log(form);

  // For an extra field for the FormData
      data.append("CustomField", "This is some extra data, testing");

  // disabled the submit button
      $("#btnSubmit").prop("disabled", true);

      $.ajax({
          type: "POST",
          enctype: 'multipart/form-data',
          url: "/account/create",
          data: data,
          processData: false,
          contentType: false,
          cache: false,
          timeout: 600000,
          success: function (data) {

              $("#result").text(data);
              console.log("SUCCESS : ", data);
              $("#btnSubmit").prop("disabled", false);

          },
          error: function (e) {

              console.log("ERROR : ", e);
              $("#btnSubmit").prop("disabled", false);

          }
      });

  });

});