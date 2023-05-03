function generateProfileDataHTML(username, avatar) {
  // Create the HTML elements
  const profileDiv = document.createElement('div');
  const avatarImg = document.createElement('img');
  const usernameDiv = document.createElement('div');

  // Change appearance
  avatarImg.width = 140;
  avatarImg.height = 140;

  // Set the class names
  profileDiv.className = 'profile';
  avatarImg.className = 'profile_avatar';
  usernameDiv.className = 'profile_username';

  // Set content
  avatarImg.src = avatar;
  usernameDiv.textContent = username;

  // Append the child elements
  profileDiv.appendChild(avatarImg);
  profileDiv.appendChild(usernameDiv);

  // Return the HTML string
  return profileDiv.outerHTML;
}

function getProfileData() {
  let url = '/profile/'+ getUserName();

  let p = fetch(url);
  let ps = p.then( (response) => {
    return response.json();
  }).then((posts) => { 
    console.log(posts[0].username);
    console.log(posts[0].img);
  let html = '';
  //   for (let i = posts.length-1; i >= 0; i--) {
  html += generateProfileDataHTML(posts[0].username, posts[0].img);
  // }
    let x = document.getElementById('profileData');
    if (x){
      x.innerHTML = html;
    }
    
  }).catch((error) => { 
      console.log(error);
    alert('Something went wrong trying to set html for posts');
  });
}

function getPostsForUser() {
    let url = '/posts/'+ getUserName();

    let p = fetch(url);
    let ps = p.then( (response) => {
      return response.json();
    }).then((posts) => { 
      let html = '';
      for (let i = posts.length-1; i >= 0; i--) {
        html += generatePostHTML(posts[i].username, posts[i].dateCreated, posts[i].text, posts[i].comments, posts[i].avatar,posts[i].image);
    }
      let x = document.getElementById('userPosts');
      if (x){
        x.innerHTML = html;
      }
      
    }).catch((error) => { 
        console.log(error);
      alert('Something went wrong trying to set html for posts');
    });
  }