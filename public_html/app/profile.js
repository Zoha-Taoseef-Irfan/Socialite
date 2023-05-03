function generateProfileDataHTML(username, avatar, bio) {
  // Create the HTML elements
  const profileDiv = document.createElement('div');
  const avatarImg = document.createElement('img');
  const usernameDiv = document.createElement('div');
  const bioDiv = document.createElement('div');

  // Change appearance
  avatarImg.width = 140;
  avatarImg.height = 140;

  // Set the class names
  profileDiv.className = 'profile';
  avatarImg.className = 'profile_avatar';
  usernameDiv.className = 'profile_username';
  bioDiv.className = 'profile_bio';

  // Set content
  avatarImg.src = avatar;
  usernameDiv.textContent = username;
  bioDiv.textContent = bio;

  // Append the child elements
  profileDiv.appendChild(avatarImg);
  profileDiv.appendChild(usernameDiv);
  profileDiv.appendChild(bioDiv);

  // Return the HTML string
  return profileDiv.outerHTML;
}

function getProfileData() {
  let url = '/profile/'+ getUserName();

  let p = fetch(url);
  let ps = p.then( (response) => {
    return response.json();
  }).then((posts) => { 
    
  let html = '';
  //   for (let i = posts.length-1; i >= 0; i--) {
  html += generateProfileDataHTML(posts[0].username, posts[0].img, posts[0].bio);
  console.log(posts[0].bio);
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
        let curPost = posts[i];
        html += generatePostHTML(curPost.username, curPost.dateCreated, curPost.text, curPost.comments, curPost.avatar, curPost.image, curPost._id, curPost.likeCount, curPost.likedUsers);
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