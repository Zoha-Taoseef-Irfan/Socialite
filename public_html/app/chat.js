currentUser = getUserName();

function getUserName(){
  console.log(document.cookie);
  let userName = document.cookie.split("%22")[3];
  currentUser = userName;
  return currentUser;
}
//
function myProfile(){
  window.location.href = '/app/profile.html';
}
//
function chat(){
    window.location.href = '/app/chat.html';
}

function exploreFriends(){
  window.location.href = '/app/exploreFriends.html';
}

function viewFollowing(){
  window.location.href = '/app/following.html';
}
function scrollToLatestMessage() {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
  
  function getMessageItems() {
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
        scrollToLatestMessage();
      }
    });
    
  }

  /*
  This function is ran to send messages to the server. When the user hits the Send Message button, 
  the alias and the message text is grabbed, the information sent to the server for storage  and the message text box should be cleared, 
  so that the user can start typing the next message.
  */
  function createMessageItem() {
  
    let alias = currentUser;
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
            getMessageItems();
            document.getElementById('message').value ="";    
            scrollToLatestMessage();   
    });
    
   
  }
  
  setInterval(getMessageItems,1500);