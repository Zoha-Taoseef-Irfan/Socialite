/*
Authors: Amimul Ehsan Zoha, Taoseef Aziz, Irfan Ahmad
Course: CS337 Spring 2023
Project: Socialite Social Media

Description: This JavaScript file contains functions for a social media web application.
The first function, getUserName(), retrieves the username from a cookie and returns it.
The following functions, myProfile(), chat(), exploreFriends(), and viewFollowing(),
redirect the user to various pages within the web application.
The scrollToLatestMessage() function scrolls to the latest message in a chat container.
The getMessageItems() function uses the fetch API to get messages from the server and display them in a chat container.
The createMessageItem() function sends a message to the server for storage and clears the message text box.
The setInterval() method is used to call getMessageItems() function at an interval of 1500 milliseconds.
*/

currentUser = getUserName();


function getUserName(){
  console.log(document.cookie);
  let userName = document.cookie.split("%22")[3];
  currentUser = userName;
  return currentUser;
}

function generatePostHTML(username, date, postText, comments, img, postImg, postId, likeCount, likedUsers) {
    //console.log("postImg: "+postImg);
  
    // Create the HTML elements
    const postDiv = document.createElement('div');
    const postHeaderDiv = document.createElement('div');
    const postContentDiv = document.createElement('div');
    const postImageImg = document.createElement('img');
    const postCommentsDiv = document.createElement('div');
    const usernameDateDiv = document.createElement('div');
    const postTextDiv = document.createElement('div');
    const avatarImg = document.createElement('img');

    // Change appearance
    avatarImg.width = 100;
    avatarImg.height = 100;
    postImageImg.width = 300;
    postImageImg.height = 300;
  
    // Set the class names
    postDiv.className = 'post';
    postHeaderDiv.className= 'postHeader';
    postContentDiv.className= 'postContent';
    usernameDateDiv.className = 'username_date';
    postTextDiv.className = 'posttext';
    postImageImg.className = 'postImageImg';
    postCommentsDiv.className = 'postComments';
    
    avatarImg.className= 'post_avatar';

    // Set content
    usernameDateDiv.textContent = `${username} ${date}`;
    postImageImg.src= postImg;
    postTextDiv.textContent = postText;

    // postCommentsDiv.textContent = comments.join('\n');
    for(let i=0; i<comments.length; i++){
      var commentDiv = document.createElement('div');
      var postCommentNameDiv = document.createElement('div');
      var postCommentCommentDiv = document.createElement('div');
      var comment = comments[i].split('\n\n');
      postCommentNameDiv.className = 'commentName';
      postCommentCommentDiv.className = 'commentText';
      commentDiv.className = 'comment';
      postCommentNameDiv.textContent = comment[0];
      postCommentCommentDiv.textContent = comment[1];
      commentDiv.appendChild(postCommentNameDiv);
      commentDiv.appendChild(postCommentCommentDiv);
      postCommentsDiv.appendChild(commentDiv);
    }
    avatarImg.src = img;

    // Append the child elements
    postHeaderDiv.appendChild(avatarImg);
    postHeaderDiv.appendChild(usernameDateDiv);
    postContentDiv.appendChild(postTextDiv);
    postContentDiv.appendChild(postImageImg);

    console.log("postid= "+postId)

    let functioncallComment = "postComment('"+ getUserName()+"','"+postId+"');";
    functioncallComment += "getPosts();";

    postCommentsDiv.innerHTML += "<label for='"+postId+"'>Make a comment</label>"
    postCommentsDiv.innerHTML += "<input type=text class=postCommentsInput id='"+postId+"'/>"
    let commentButtonHTML = "<button class=commentBtn onclick="+functioncallComment+">Comment</button>"; 
    postCommentsDiv.insertAdjacentHTML('beforeend',commentButtonHTML);
    
    // creating like button
    console.log("liked users in target place: "+ likedUsers)
    // check if cur user in likedUsers list
    let likeBtnStyle = '';
    if(likedUsers.includes(getUserName())) {
      let likeafter = "icons/likeafter.jpg"
      likeBtnStyle += "style=background-image:url("+likeafter+");"
    } else {
      let likebefore = "icons/likebefore.png"
      likeBtnStyle += "style=background-image:url("+likebefore+");"
    }
    let likeid = postId+'_like'
    let functioncallLike = "likePost('"+ getUserName()+"','"+likeid+"');";
    functioncallLike += "getPosts();";
    let likeBtnHTML = "<button "+likeBtnStyle+" id="+"'"+likeid+"'"+"class=fb-like-button onclick="+functioncallLike+">"+likeCount+"</button>"; 
    postCommentsDiv.insertAdjacentHTML('beforeend',likeBtnHTML);

    postDiv.appendChild(postHeaderDiv);
    postDiv.appendChild(postContentDiv);
    postDiv.appendChild(postCommentsDiv);
    
    // Return the HTML string
    return postDiv.outerHTML;
  }
  
  function postComment(username, postid) {
    var comment = document.getElementById(postid).value;
    console.log(username)
    console.log(comment);
    let url = '/create/comment/'+postid+'/'+username+'/'+comment;
    let p = fetch(url);
    p.then(responseStr=> {
      console.log(responseStr);
    })
  } 

  function likePost(username, likeid) {
    let postid = likeid.split('_')[0];
    console.log(username)
    console.log(postid)
    console.log(likeid)

    let url = '/like/post/'+postid+'/'+username;
    let p = fetch(url);
    p.then(responseStr=> {
      console.log(responseStr);
    })

    let likeimg='icons/likeafter.jpg'
    $('#'+likeid).css('background-image', 'url(' + likeimg + ')');
    
  } 
