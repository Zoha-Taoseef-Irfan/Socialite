function getPostsForUser() {
    let url = '/posts/'+ getUserName();

    let p = fetch(url);
    let ps = p.then( (response) => {
      return response.json();
    }).then((objects) => { 
      let html = '';
      for (i in objects) {
        html += generatePostHTML(objects[i].username, objects[i].dateCreated, objects[i].text, objects[i].comments, objects[i].avatar);
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