currentUser = getUserName();

function getUserName() {
    console.log(document.cookie);
    let userName = document.cookie.split("%22")[3];
    currentUser = userName;
    return currentUser;
}

function getAllFollowing() {
  let url = '/followed/'+getUserName();
  console.log("fetching at URL: "+url)
  let p = fetch(url);
  let ps = p
    .then((response) => {
      console.log("got response at URL: "+response)

      return response.json();
    })
    .then((users) => {
      console.log("users = "+users)
      console.log()

      let html = '';
      for (let i = 0; i < users.length; i++) {
        
        console.log("users[i].name = "+users[i].username)
        // console.log("users[i].following = "+users[i].following)
        console.log("users[i].img = "+users[i].img)

        // need to filter with users followed: 
        // user.following.includes(friend._id) --> need following list
        html +=  generateFollowlistHTML(users[i].username, users[i].img);
      }
      let parentContainer = document.createElement('div');
      parentContainer.setAttribute('id', 'friends-container');
      parentContainer.innerHTML = html;
      let x = document.getElementById('followedUsers');
      if (x) {
        x.innerHTML = '';
        x.appendChild(parentContainer);
      }
    })
    .catch((error) => {
      console.log(error);
      alert('Something went wrong trying to display friends');
    });
}

function getFollowingData() {
  console.log('getFollowingData')
}

function generateFollowlistHTML(username, profilePicture) {
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

  // Add event listener to viewButton
  viewButton.addEventListener('click', () => {
    console.log('VIEW BUTTON CLICKED');
    window.location.href = `/profile/${username}`;
  });

  return userDiv.outerHTML;
}
