
selectedCat = 'Work';

currentUser = getUserName();

function getUserName(){
  console.log(document.cookie);
  let userName = document.cookie.split("%22")[3];
  currentUser = userName;
  return currentUser;
}

// function getCategories() {
//   let url = '/categories/';
//   let p = fetch(url);
//   let ps = p.then( (response) => {
//     return response.json();
//   }).then((objects) => { 
//     let html = '';
//     for (i in objects) {
//       html += '<div onclick="getItemsForCategory(\'' + objects[i].name + '\')" style="color:' + objects[i].color + '">' + objects[i].name + '</div>\n'
//     }
//     let x = document.getElementById('categories');
//     x.innerHTML = html;
//   }).catch(() => { 
//     alert('something went wrong');
//   });
// }
function getPosts() {
  let url = '/posts/';
  // TODO go back and change the /categories/ route to /posts/
  let p = fetch(url);
  let ps = p.then( (response) => {
    return response.json();
  }).then((objects) => { 
    let html = '';
    for (i in objects) {
      // html += '<div class="post">' 
      //             + objects[i].username + objects[i].dateCreated + objects[i].text + 
      //         '</div>\n'
      html += generatePostHTML(objects[i].username, objects[i].dateCreated, objects[i].text, objects[i].comments);
      // TODO add button for like, and comment functionality here
    }
    let x = document.getElementById('posts');
    if (x){
      x.innerHTML = html;
    }
    
  }).catch(() => { 
    alert('Something went wrong trying to set html for posts');
  });
}

setInterval(getPosts, 1000)

function generatePostHTML(username, date, postText, comments) {
  // Create the HTML elements
  const postDiv = document.createElement('div');
  const usernameDateDiv = document.createElement('div');
  const postTextDiv = document.createElement('div');
  const allCommentsDiv = document.createElement('div');

  // Set the class names
  postDiv.className = 'post';
  usernameDateDiv.className = 'username_date';
  postTextDiv.className = 'posttext';
  allCommentsDiv.className = 'allcomments';

  // Set the text content
  usernameDateDiv.textContent = `${username} ${date}`;
  postTextDiv.textContent = postText;
  allCommentsDiv.textContent = comments.join('\n');

  // Append the child elements
  postDiv.appendChild(usernameDateDiv);
  postDiv.appendChild(postTextDiv);
  postDiv.appendChild(allCommentsDiv);

  // Return the HTML string
  return postDiv.outerHTML;
}





function createPost() {
  let postTXT = document.getElementById('postText').value;
  // TODO image left out for now
  // TODO set global username, and use it when posting
  let url = '/create/post/';
  let data = { username: currentUser, text: postTXT};
  let p = fetch(url, {
    method: 'POST', 
    body: JSON.stringify(data),
    headers: {"Content-Type": "application/json"}
  });
  p.then(() => {
    console.log('Post Created');
    getPosts();
  });
  p.catch(() => { 
    alert('Something went wrong after creating a post');
  });
}



// function chat(){
//   window.location.href = '/app/chat.html';
// }
// function getItems() {
//   //use the fetch api to get from the server
//   let url = '/chats';
//   let p = fetch(url);
//   let ps = p.then((response) => {
//       return response.text();
//   });
//   ps.then((text) => {
//     // display the results on the screen (front end)
//     let x = document.getElementById('messages');

//     x.innerHTML= text;
//   });
// }

// function getItems() {
//   //use the fetch api to get from the server
//   let url = '/chats';
//   let p = fetch(url);
//   let ps = p.then((response) => {
//       return response.text();
//   });
//   ps.then((text) => {
//     // display the results on the screen (front end)
//     let x = document.getElementById('messages');

//     x.innerHTML= text;
//   });
// }
// /*
// This function is ran to send messages to the server. When the user hits the Send Message button, 
// the alias and the message text is grabbed, the information sent to the server for storage  and the message text box should be cleared, 
// so that the user can start typing the next message.
// */
// function createItem() {

//   let alias = document.getElementById('alias').value;
//   let message = document.getElementById('message').value;

//   let url = '/chats/post';
//   const params = {
//       alias: alias,
//       message: message, 
//   };
//   const options = {
//       method: 'POST',
//       body: JSON.stringify( params ) ,
//       headers: {'content-type': 'application/json'}
//   };
  
//   fetch(url, options )
//       .then( response => {
//           // Do something with response.
//           getItems();
//           document.getElementById('alias').value ="";
//           document.getElementById('message').value ="";       
//   });
// }
// //setInterval(getItems,1000);