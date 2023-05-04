 /* 
     Author: Amimul Ehsan Zoha; Taoseef Aziz, Irfan Ahmad
     Course: CS337 Spring 2023
     Project: Socialite Social Media
     
     Description: It is the client of full stack application using html,css , javascript, express and node.js and MongoDb which is a 
     clone of will be a social networking web app, similar to that of Facebook. (Our version is called Socialite)
     The app have the primary functionality in which the users can create accounts and login to their individual accounts. 
     For login, there is some sort of authentication mechanism. Once a user logs in, he will be assigned a session and cookies
     will be used to keep track of a time after which this session will be over and redirected to the login page. After logging in, 
     the user is redirected to the home page, which will be similar to that of a facebook. The home page will contain contents like the timeline of recent posts (of all users), 
     and each post will have the option to be liked and commented on. There will be the option to upload images in a post. Users can be friends with each other. 
     Users will be able to chat in a global chatroom messaging app inside of Socialite. There will be another page to view the
     users own profile photo, his information and bio. The post images are nicely styled, they have hovering effect, and other
     nice styling additions. The client serves sure of all this functionality by making different requests to the server
     using fetch api. The server has well defined MongoDB schemas which outline the whole database of the socialite app. 
     The experience of developing this large scale project was difficult, yet worthwhile and an incredible learning experience 
     in which we gained mastery over making server using express framework, designing large scale web app, working with mongo BD 
     and making requests using the Fetch API. We stramlined collaboration with Github version control. 

  */

function getPosts() {
  let url = '/posts/';
  // TODO go back and change the /categories/ route to /posts/
  let p = fetch(url);
  let ps = p.then( (response) => {
    return response.json();
  }).then((posts) => { 
    let html = '';
    for (let i = posts.length-1; i >= 0; i--) {
      let curPost = posts[i];
      html += generatePostHTML(curPost.username, curPost.dateCreated, curPost.text, curPost.comments, curPost.avatar, curPost.image, curPost._id, curPost.likeCount, curPost.likedUsers);
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
            getPosts();
          },
          error: function (e) {

              console.log("ERROR : ", e);
              $("#createPostButton").prop("disabled", false);

          }
      });

  });

});


// setInterval(getPosts, 5000);