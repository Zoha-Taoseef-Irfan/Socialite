currentUser = getUserName();

function getUserName() {
    console.log(document.cookie);
    let userName = document.cookie.split("%22")[3];
    currentUser = userName;
    return currentUser;
}

// Adds user as a friend
function addFriend(addButton) {
    const userID = getUserName();
    const friendID = addButton.getAttribute('friendID');
    console.log(userID + " is trying to add " +  friendID + " as a friend.");

    const url = `http://localhost:3000/addFriend`;
    const params = {
        user: userID,
        friend: friendID
    };
    const options = {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {'Content-Type': 'application/json'}
    };

    fetch(url, options)
        .then(response => {
            addButton.style.backgroundColor = '#8BC34A';
            addButton.innerText = 'Added';
            addButton.disabled = true; // Disable button to prevent multiple adds
        })
        .catch(error => console.error(error));
}
  

// Output all users on Socialite onto the page
function exploreFriends() {
    console.log("exploreFriends function called");
    let url = '/users/';
    let p = fetch(url);
    let ps = p
      .then((response) => {
        return response.json();
      })
      .then((users) => {
        let html = '';
        for (let i = 0; i < users.length; i++) {
          html += generateUsersHTML(users[i].username, users[i].img);
        }
        let parentContainer = document.createElement('div');
        parentContainer.setAttribute('id', 'friends-container');
        parentContainer.innerHTML = html;
        let x = document.getElementById('friends');
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

// Generate divs for each user, including their name picture and add friend button
function generateUsersHTML(username, profilePicture) {
    // Create the HTML elements
    const userDiv = document.createElement('div');
    const usernameDiv = document.createElement('div');
    const avatarImg = document.createElement('img');
    const addButton = document.createElement('button');
  
    // Change appearance
    avatarImg.width = 100;
    avatarImg.height = 100;
  
    // Label button
    addButton.innerText = 'Add Friend';
    addButton.setAttribute('friendID', username);
  
    // Set the class names
    userDiv.className = 'explore-user';
    usernameDiv.className = 'explore-username';
    avatarImg.className = 'explore-avatar';
    addButton.className = 'add-friend-button';
  
    // Set content
    usernameDiv.textContent = username;
    avatarImg.src = profilePicture;
  
    // Append the child elements
    userDiv.appendChild(avatarImg);
    userDiv.appendChild(usernameDiv);
    userDiv.appendChild(addButton);

    // Return the HTML string
    return userDiv.outerHTML;
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-friend-button')) {
      addFriend(event.target);
    }
});