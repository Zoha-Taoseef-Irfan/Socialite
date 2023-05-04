currentUser = getUserName();
viewUsers = "";

function getUserName() {
    console.log(document.cookie);
    let userName = document.cookie.split("%22")[3];
    currentUser = userName;
    return currentUser;
}

function getAllFollowing() {
  var url = '/followed/'+getUserName();
  console.log("fetching at URL: "+url)
  var p = fetch(url);
  var ps = p
    .then((response) => {
      console.log("got response at URL: "+response)
      return response.json();
    })
    .then((allusers) => {
      console.log("users = "+allusers)
      console.log()

      var url = '/users/'+getUserName();
      console.log("fetching at URL: "+url)
      var p2 = fetch(url);
      p2.then(response=> {
        response.json().then(userObj=> {
          var html = '';
          for (var i = 0; i < allusers.length; i++) {
            console.log("OBJECT.FOLLOWINGL "+userObj.following)

            console.log("allusers[i].name = "+allusers[i].username)
            // console.log("users[i].following = "+users[i].following)
            console.log("allusers[i].img = "+allusers[i].img)

            // need to filter with users followed: 
            // user.following.includes(friend._id) --> need following list       
              generateFollowlistHTML(allusers[i].username, allusers[i].img, currentUser);
            }

            // var x = document.getElementById('followedUsers');
            // if (x) {
            //   x.innerHTML = html;
            //   //x.appendChild(parentContainer);
            // }
      })
        
      }).catch((err)=> {
        console.log(err);
      })

    })
    .catch((error) => {
      console.log(error);
      alert('Something went wrong trying to display friends');
    });
}

function getFollowingData() {
  console.log('getFollowingData')
}

async function generateFollowlistHTML(username, profilePicture, currentUser) {

  var url = 'http://localhost:3000/isFollowing';
  var params = {
    user: currentUser,
    friend: username
  };
  var options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {'Content-Type': 'application/json'}
  };

  var response = await fetch(url, options);
  var result = await response.json();

  if (!result.isFollowing) {
    return '';
  };

  console.log("USERNAME " + currentUser);
  console.log("CHECKING IF WERE FOLLOWING " + username);
  console.log("Image Tag" + profilePicture);
  var userDiv = document.createElement('div');
  var avatarImg = document.createElement('img');
  var usernameDiv = document.createElement('div');
  var viewButton = document.createElement('button');

  avatarImg.width = 100;
  avatarImg.height = 100;

  userDiv.className = 'followed-user';
  avatarImg.className = 'followed-avatar';
  usernameDiv.className = 'followed-username';
  viewButton.className = 'followed-button';

  avatarImg.src = profilePicture;
  usernameDiv.textContent = username;
  viewButton.textContent = 'View';

  viewButton.setAttribute('viewID', username);

  userDiv.appendChild(avatarImg);
  userDiv.appendChild(usernameDiv);
  userDiv.appendChild(viewButton);

  var x = document.getElementById('followedUsers');
  if (x) {
    x.innerHTML += userDiv.outerHTML;
    //x.appendChild(parentContainer);
  }
  return userDiv.outerHTML;
}

function getPostsForUser(username) {
  console.log('getting posts for specific user')
  let url = '/posts/'+ username;

  let p = fetch(url);
  let ps = p.then( (response) => {
    return response.json();
  }).then((posts) => { 
    let html = '';
    for (let i = posts.length-1; i >= 0; i--) {
      let curPost = posts[i];
      html += generatePostHTML(curPost.username, curPost.dateCreated, curPost.text, curPost.comments, curPost.avatar, curPost.image, curPost._id, curPost.likeCount, curPost.likedUsers);
    }
    let x = document.getElementById('followingData');
    if (x){
      x.innerHTML = html;
    }
    
  }).catch((error) => { 
      console.log(error);
    alert('Something went wrong trying to set html for posts');
  });
}
document.addEventListener('click', (event) => {
  console.log('clicking')
  if (event.target.classList.contains('followed-button')) {
    getPostsForUser(event.target.viewID);
  }
});