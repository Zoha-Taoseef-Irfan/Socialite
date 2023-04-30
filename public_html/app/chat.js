function chat(){
    window.location.href = '/app/chat.html';
}
  
function getItems() {
  //use the fetch api to get from the server
  let url = '/chats';
  let p = fetch(url);
  let ps = p.then((response) => {
      return response.text();
  });
  ps.then((text) => {
    // display the results on the screen (front end)
    let x = document.getElementById('messages');
    if (x){
      x.innerHTML= text;
    }
  });
}

/*
This function is ran to send messages to the server. When the user hits the Send Message button, 
the alias and the message text is grabbed, the information sent to the server for storage  and the message text box should be cleared, 
so that the user can start typing the next message.
*/
function createItem() {

  let alias = document.getElementById('alias').value;
  let message = document.getElementById('message').value;

  let url = '/chats/post';
  const params = {
      alias: alias,
      message: message, 
  };
  const options = {
      method: 'POST',
      body: JSON.stringify( params ) ,
      headers: {'content-type': 'application/json'}
  };
  
  fetch(url, options )
      .then( response => {
          // Do something with response.
          getItems();
          document.getElementById('alias').value ="";
          document.getElementById('message').value ="";       
  });
}



setInterval(getItems,1000);
