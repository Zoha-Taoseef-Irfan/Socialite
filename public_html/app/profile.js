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