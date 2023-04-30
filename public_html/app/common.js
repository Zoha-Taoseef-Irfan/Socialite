currentUser = getUserName();

function getUserName(){
  console.log(document.cookie);
  let userName = document.cookie.split("%22")[3];
  currentUser = userName;
  return currentUser;
}

function generatePostHTML(username, date, postText, comments, img) {
    console.log(currentUser);
    console.log("username for generating html: "+username)
  
    // Create the HTML elements
    const postDiv = document.createElement('div');
    const postHeaderDiv = document.createElement('div');
    const postContentDiv = document.createElement('div');
    const postCommentsDiv = document.createElement('div');
  
    const usernameDateDiv = document.createElement('div');
    const postTextDiv = document.createElement('div');
    const avatarImg = document.createElement('img');
  
    // Change appearance
    avatarImg.width = 100;
    avatarImg.height = 100;
  
    // Set the class names
    postDiv.className = 'post';
    postHeaderDiv.className= 'postHeader';
    postContentDiv.className= 'postContent';
    usernameDateDiv.className = 'username_date';
    postTextDiv.className = 'posttext';
    postCommentsDiv.className = 'postComments';
    avatarImg.className= 'post_avatar';
  
    // Set content
    usernameDateDiv.textContent = `${username} ${date}`;
    postTextDiv.textContent = postText;
    postCommentsDiv.textContent = comments.join('\n');
    avatarImg.src = img;
  
    // Append the child elements
    postHeaderDiv.appendChild(avatarImg);
    postHeaderDiv.appendChild(usernameDateDiv);
    postContentDiv.appendChild(postTextDiv);
  
    postDiv.appendChild(postHeaderDiv);
    postDiv.appendChild(postContentDiv);
    postDiv.appendChild(postCommentsDiv);
    
    // Return the HTML string
    return postDiv.outerHTML;
  }
  