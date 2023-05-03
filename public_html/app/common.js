currentUser = getUserName();

function getUserName(){
  console.log(document.cookie);
  let userName = document.cookie.split("%22")[3];
  currentUser = userName;
  return currentUser;
}

function generatePostHTML(username, date, postText, comments, img, postImg, postId, likeCount, likedUsers) {
    //console.log("postImg: "+postImg);
    console.log("likedUsers for post: "+postId+" : "+likedUsers)
  
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
      commentDiv.className = 'comment';
      commentDiv.textContent = comments[i];
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

    postCommentsDiv.innerHTML += "<label for='"+postId+"'>Make a comment</label>"
    postCommentsDiv.innerHTML += "<input type=text class=postCommentsInput id='"+postId+"'/>"
    let likeButton = "<button class=commentBtn onclick="+functioncallComment+">Comment</button>"; 
    postCommentsDiv.insertAdjacentHTML('beforeend',likeButton);
    
    // const likeButton = document.createElement('button');
    // likeButton.classList.add('fb-like-button');
    // postDiv.appendChild(likeButton);
    let likeid = postId+'_like'
    let functioncallLike = "likePost('"+ getUserName()+"','"+likeid+"');";
    console.log("likecount: "+likeCount)
    postCommentsDiv.innerHTML += "<button id="+"'"+likeid+"'"+"class=fb-like-button onclick="+functioncallLike+">"+likeCount+"</button>"; 

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

    let likeimg='https://w7.pngwing.com/pngs/377/493/png-transparent-social-media-facebook-like-button-facebook-like-button-youtube-social-media-company-rectangle-thumb-signal.png'
    $('#'+likeid).css('background-image', 'url(' + likeimg + ')');
    
  } 