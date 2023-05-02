
function getPosts() {
  let url = '/posts/';
  // TODO go back and change the /categories/ route to /posts/
  let p = fetch(url);
  let ps = p.then( (response) => {
    return response.json();
  }).then((posts) => { 
    let html = '';
    for (let i = posts.length-1; i >= 0; i--) {
      html += generatePostHTML(posts[i].username, posts[i].dateCreated, posts[i].text, posts[i].comments, posts[i].avatar, posts[i].image);
      // TODO add button for like, and comment functionality here
    }
    let x = document.getElementById('posts');
    if (x){
      x.innerHTML = html;
    }
    
  }).catch((error) => { 
    alert('Something went wrong trying to set html for posts');
    console.log(error);
  });
}

$(document).ready(function () {

  $("#createPostButton").click(function (event) {

      //stop submit the form, we will post it manually.
      event.preventDefault();

      // Get form
      var form = $('#createPost')[0];
      console.log("printing form: "+form)

      // Create a FormData object 
      var data = new FormData(form);

      // For an extra field for the FormData
      data.append("username", currentUser);

     // disabled the submit button
      $("#createPostButton").prop("disabled", true);

      $.ajax({
          type: "POST",
          enctype: 'multipart/form-data',
          url: "/create/post",
          data: data,
          processData: false,
          contentType: false,
          cache: false,
          timeout: 600000,
          success: function (data) {

            console.log("SUCCESS : ", data);
              $("#createPostButton").prop("disabled", false);

          },
          error: function (e) {

              console.log("ERROR : ", e);
              $("#createPostButton").prop("disabled", false);

          }
      });

  });

});

setInterval(getPosts, 5000);