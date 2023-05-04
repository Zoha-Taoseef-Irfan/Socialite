currentUser = getUserName();

function getUserName() {
    console.log(document.cookie);
    let userName = document.cookie.split("%22")[3];
    currentUser = userName;
    return currentUser;
}

async function getAllFollowing() {
  const currentUser = getUserName();
  let url = `/followed?user=${currentUser}`;
  let p = fetch(url);
  console.log(p);
  let ps = p
    .then((response) => {
      return response.json();
    })
    .then(async (followedUser) => {
      let html = '';
      for (let i = 0; i < followedUser.length; i++) {
        html += await generateFollowlistHTML(followedUser[i].username, followedUser[i].img);
        console.log("USER: " + followedUser[i].username);
      }
      let parentContainer = document.createElement('div');
      parentContainer.setAttribute('id', 'followed-container');
      parentContainer.innerHTML = html;
      let x = document.getElementById('followedUsers');
      if (x) {
        x.innerHTML = '';
        x.appendChild(parentContainer);
      }
    })
    .catch((error) => {
      console.log(error);
      alert('Something went wrong trying to display followed Users');
    });
}


function getFollowingData() {
  console.log('getFollowingData')
}

async function generateFollowlistHTML(username, profilePicture) {
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
