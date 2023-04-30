
selectedCat = 'Work';

currentUser = getUserName();

function getUserName(){
  console.log(document.cookie);
  let userName = document.cookie.split("%22")[3];
  currentUser = userName;
  return currentUser;
}
function getPostsForUser() {
  let url = '/posts/'+ currentUser;
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
    let x = document.getElementById('userPosts');
    if (x){
      x.innerHTML = html;
    }
    
  }).catch(() => { 
    alert('Something went wrong trying to set html for posts');
  });
}

setInterval(getPostsForUser, 1000)


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
