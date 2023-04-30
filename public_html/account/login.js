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

  // If you want to add an extra field for the FormData
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

              $("#result").text(e.responseText);
              console.log("ERROR : ", e);
              $("#btnSubmit").prop("disabled", false);

          }
      });

  });

});