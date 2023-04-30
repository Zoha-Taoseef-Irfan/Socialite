
function getPosts() {
  let url = '/posts/';
  // TODO go back and change the /categories/ route to /posts/
  let p = fetch(url);
  let ps = p.then( (response) => {
    return response.json();
  }).then((objects) => { 
    let html = '';
    for (i in objects) {
      html += generatePostHTML(objects[i].username, objects[i].dateCreated, objects[i].text, objects[i].comments, objects[i].avatar);
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

setInterval(getPosts, 1000);