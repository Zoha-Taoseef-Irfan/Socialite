currentUser = getUserName();

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
              html +=  generateFollowlistHTML(allusers[i].username, allusers[i].img, currentUser);
            }

            var x = document.getElementById('followedUsers');
            if (x) {
              x.innerHTML = html;
              //x.appendChild(parentContainer);
            }
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

  const url = 'http://localhost:3000/isFollowing';
  const params = {
    user: currentUser,
    friend: username
  };
  const options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {'Content-Type': 'application/json'}
  };

  const response = await fetch(url, options);
  const result = await response.json();

  if (!result.isFollowing) {
    return '';
  };

  console.log("USERNAME " + currentUser);
  console.log("CHECKING IF WERE FOLLOWING " + username);
  console.log("Image Tag" + profilePicture);
  const userDiv = document.createElement('div');
  const avatarImg = document.createElement('img');
  const usernameDiv = document.createElement('div');
  const viewButton = document.createElement('button');

  avatarImg.width = 100;
  avatarImg.height = 100;

  userDiv.className = 'followed-user';
  avatarImg.className = 'followed-avatar';
  usernameDiv.className = 'followed-username';
  viewButton.className = 'followed-button';

  avatarImg.src = profilePicture;
  usernameDiv.textContent = username;
  viewButton.textContent = 'View';

  userDiv.appendChild(avatarImg);
  userDiv.appendChild(usernameDiv);
  userDiv.appendChild(viewButton);

  console.log("USERDIV OUTPUT " + userDiv.outerHTML);
  return userDiv.outerHTML;
}