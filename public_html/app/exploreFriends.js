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
// function exploreFriends() {
//     console.log("exploreFriends function called");
//     let url = '/users/';
//     let p = fetch(url);
//     let ps = p
//       .then((response) => {
//         return response.json();
//       })
//       .then((users) => {
//         let html = '';
//         for (let i = 0; i < users.length; i++) {
//           html += generateUsersHTML(users[i].username, users[i].img, currentUser);
//         }
//         let parentContainer = document.createElement('div');
//         parentContainer.setAttribute('id', 'friends-container');
//         parentContainer.innerHTML = html;
//         let x = document.getElementById('friends');
//         if (x) {
//           x.innerHTML = '';
//           x.appendChild(parentContainer);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         alert('Something went wrong trying to display friends');
//       });
// }

async function exploreFriends() {
    console.log("exploreFriends function called");
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

    const url = 'http://localhost:3000/isFriend';
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

    if (result.isFriend) {
        addButton.innerText = 'Added';
        addButton.className = 'added-friend-button';
        addButton.disabled = true;
    } else {
        addButton.innerText = 'Add Friend';
        addButton.className = 'add-friend-button';
    }

    addButton.classList.add('add-friend-button');

    return userDiv.outerHTML;
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-friend-button')) {
      addFriend(event.target);
    }
});