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

    const button = document.createElement('button');
    const icon = document.createElement('span');
    const text = document.createElement('span');

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
    button.classList.add('fb-like-button');
    icon.classList.add('fb-like-icon');
    text.classList.add('fb-like-text');

    // Set content
    usernameDateDiv.textContent = `${username} ${date}`;
    postTextDiv.textContent = postText;
    postCommentsDiv.textContent = comments.join('\n');
    avatarImg.src = img;
    text.textContent = '0';
  
    // Append the child elements
    postHeaderDiv.appendChild(avatarImg);
    postHeaderDiv.appendChild(usernameDateDiv);
    postContentDiv.appendChild(postTextDiv);

    // Add the icon and text elements to the button
    button.appendChild(icon);
    button.appendChild(text);
  
    postDiv.appendChild(postHeaderDiv);
    postDiv.appendChild(postContentDiv);
    postDiv.appendChild(postCommentsDiv);
    postDiv.appendChild(button);
    
    // Return the HTML string
    return postDiv.outerHTML;
  }
  