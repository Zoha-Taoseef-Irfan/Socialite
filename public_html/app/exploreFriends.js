/*
Authors: Amimul Ehsan Zoha, Taoseef Aziz, Irfan Ahmad
Course: CS337 Spring 2023
Project: Socialite Social Media

This code defines several functions related to following users and displaying users for the Socialite Social Media project. 
The getUserName() function retrieves the username of the current user from a cookie and sets it as the global variable currentUser. 
The addFriend() function adds a friend by sending a POST request to the server and disabling the follow button. 
The exploreFriends() function displays all users on the server by generating HTML elements with the generateUsersHTML() function. 
The generateUsersHTML() function creates HTML elements for each user, including their profile picture, username, and add friend button. 
The click event listener at the bottom of the code executes the addFriend() function when a user clicks the add friend button.
*/

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

    const url = `http://localhost:3000/followUser`;
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
            addButton.innerText = 'Following';
            addButton.disabled = true; // Disable button to prevent multiple adds
        })
        .catch(error => console.error(error));
}

async function exploreFriends() {
    let url = '/users/';
    let p = fetch(url);
    let ps = p
      .then((response) => {
        return response.json();
      })
      .then(async (users) => {
        let html = '';
        for (let i = 0; i < users.length; i++) {
          html += await generateUsersHTML(users[i].username, users[i].img, currentUser);
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
async function generateUsersHTML(username, profilePicture, currentUser) {
    // Current user excluded from explore friends 
    if (username === currentUser) {
        return '';
    }

    const userDiv = document.createElement('div');
    const usernameDiv = document.createElement('div');
    const avatarImg = document.createElement('img');
    const addButton = document.createElement('button');

    avatarImg.width = 100;
    avatarImg.height = 100;

    addButton.setAttribute('friendID', username);

    userDiv.className = 'explore-user';
    usernameDiv.className = 'explore-username';
    avatarImg.className = 'explore-avatar';

    usernameDiv.textContent = username;
    avatarImg.src = profilePicture;

    userDiv.appendChild(avatarImg);
    userDiv.appendChild(usernameDiv);
    userDiv.appendChild(addButton);

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

    if (result.isFollowing) {
        addButton.innerText = 'Following';
        addButton.className = 'following-button';
        addButton.disabled = true;
    } else {
        addButton.innerText = 'Follow';
        addButton.className = 'follow-button';
    }

    addButton.classList.add('follow-button');

    return userDiv.outerHTML;
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('follow-button')) {
      addFriend(event.target);
    }
});