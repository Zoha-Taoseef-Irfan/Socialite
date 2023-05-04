/* 
     Author: Amimul Ehsan Zoha; Taoseef Aziz, Irfan Ahmad
     Course: CS337 Spring 2023
     Project: Socialite Social Media

     
     It is the server of full stack application using html,css , javascript, express and node.js and MongoDb which is a 
     clone of will be a social networking web app, similar to that of Facebook. (Our version is called Socialite)
     The app have the primary functionality in which the users can create accounts and login to their individual accounts. 
     For login, there is some sort of authentication mechanism. Once a user logs in, he will be assigned a session and cookies
     will be used to keep track of a time after which this session will be over and redirected to the login page. After logging in, 
     the user is redirected to the home page, which will be similar to that of a facebook. The home page will contain contents like the timeline of recent posts (of all users), 
     and each post will have the option to be liked and commented on. There will be the option to upload images in a post. Users can be friends with each other. 
     Users will be able to chat in a global chatroom messaging app inside of Socialite. There will be another page to view the
     users own profile photo, his information and bio. The post images are nicely styled, they have hovering effect, and other
     nice styling additions. The client serves sure of all this functionality by making different requests to the server
     using fetch api. The server has well defined MongoDB schemas which outline the whole database of the socialite app. 
     The experience of developing this large scale project was difficult, yet worthwhile and an incredible learning experience 
     in which we gained mastery over making server using express framework, designing large scale web app, working with mongo BD 
     and making requests using the Fetch API. We stramlined collaboration with Github version control. 
  */


// importing libraries
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');
const cm = require('./customsessions');

var multer = require('multer');
var path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public_html','app','uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})
var upload = multer({ storage: storage });

const parser = require('body-parser')

cm.sessions.startCleanup();

const connection_string = 'mongodb://127.0.0.1/socialmedia';

mongoose.connect(connection_string);
mongoose.connection.on('error', () => {
  console.log('There was a problem connecting to mongoDB');
});

/**
 * Specify the schema for the database, including items and categories.
 */
 var UserSchema = new mongoose.Schema( {
  username: String,
  salt: Number,
  hash: String,
  email:String,
  bio:String,
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  img: String
});

var User = mongoose.model('User', UserSchema);

// schema for each post 
var PostSchema = new mongoose.Schema( {
  username: String,
  avatar: String,
  text: String,
  image: String,
  //time: String, // maybe we should avoid this and just have the data functionality if date obj can somehow give us the time
  dateCreated: String,
  comments: [String],
  likeCount: { type: Number, default: 0 },
  likedUsers: [String]
});

var Post = mongoose.model('Post', PostSchema);

var messageSchema = new mongoose.Schema({
  alias: String,    
  message: String
});
var Item = mongoose.model('Item',messageSchema);


/*
This function appears to be an authentication middleware that is designed to protect certain routes in a web application.
function takes three parameters, namely "req", "res", and "next", which are standard parameters used in middleware functions in Node.js.
The function checks whether the request contains a cookie called "login". If the cookie exists, the function attempts to verify the user's session
 by calling a function called "doesUserHaveSession" from an object called "cm.sessions".
If the session is valid, the function calls the "next" function to continue processing the request. If the session is not valid or the cookie doesn't exist, 
the function redirects the user to the account index page.
*/

function authenticate(req, res, next) {
  let c = req.cookies;
  if (c && c.login) {
    let result = cm.sessions.doesUserHaveSession(c.login.username, c.login.sid);
    if (result) {
      next();
      return;
    }
  }
  res.redirect('/account/index.html');
}

/**
 * Initialize the express app and configure with various features 
 * such as JSON parsing, static file serving, etc.
 */
const app = express();
app.use(cookieParser());    
app.use('/app/*', authenticate);
app.use(express.static('public_html'))

//app.get('/', (req, res) => { res.redirect('/app/index.html'); });
app.use(express.json())
//app.use(parser.text({type: '*/*'}));

app.use('*', (req, res, next) => {
  let c = req.cookies;
  if (c && c.login) {
    if (cm.sessions.doesUserHaveSession(c.login.username, c.login.sid)) {
      cm.sessions.addOrUpdateSession(c.login.username);
    }
  }
  next();
});

app.use(express.static('public_html'));

/**
 * Get all of the items that correspond with a particular catagory.
 * The category is specified as a part of the URL after /items/.
 */
app.get('/items/:cat', (req, res) => {
    let cat = req.params.cat;
    let p1 = Item.find({category: cat}).exec();
    p1.then( (results) => { 
      res.end( JSON.stringify(results) );
    });
    p1.catch( (error) => {
      console.log(error);
      res.end('FAIL');
    });
});

/**
 * This route is for creating a new item for a particular category. 
 * The category that the items belongs to is stored as a part of the item object in the database.
 */
app.post('/create/item/', (req, res) => {
  let newItemToSave = req.body;
  var newItem = new Item(newItemToSave);
  let p1 = newItem.save();
  p1.then( (doc) => { 
    res.end('SAVED SUCCESFULLY');
  });
  p1.catch( (err) => { 
    console.log(err);
    res.end('FAIL');
  });
});

/**
 * This route is for creating a new comment.
 */
app.get('/create/comment/:postid/:username/:comment', (req, res) => {
  let pid = req.params.postid;
  let uname = req.params.username;
  let comment = req.params.comment;
  let p1 = Post.find({_id:pid}).exec();
  p1.then( (results) => { 
    if (results.length == 1) {
      let oldPost = results[0];
      oldPost.comments.push(uname +'\n\n'+comment);
      let newPost = new Post(oldPost);
      let p2 = newPost.save();
      p2.then(result => {
        res.end('Commented successfully');
      })
      p2.catch(err=> {
        console.log('Error saving when commenting on post')
        res.end('failed save on comment post')
      })
    } else {
      res.end('Could not find post to comment on');
    }
  });
  p1.catch( (error) => {
    console.log('finding posts when commenting failed');
    res.end('finding posts when commenting failed');
  });
});
/**
 * This route is for liking a post 
 */
app.get('/like/post/:postid/:username', (req, res) => {
  let pid = req.params.postid;
  let uname = req.params.username;
  let p1 = Post.find({_id:pid}).exec();
  p1.then( (results) => { 
    if (results.length == 1) {
      let oldPost = results[0];
      if(!oldPost.likedUsers.includes(uname)) {
        oldPost.likedUsers.push(uname);
        oldPost.likeCount += 1;
        let newPost = new Post(oldPost);
        let p2 = newPost.save();
        p2.then(result => {
          res.end('Liked successfully');
        })
        p2.catch(err=> {
          console.log('Error saving when liking on post')
          res.end('failed save on like post')
        })
        console.log('Liked post!');
      } 
      else {
        oldPost.likedUsers.remove(uname);
        oldPost.likeCount -= 1;
        let newPost = new Post(oldPost);
        let p2 = newPost.save();
        p2.then(result => {
          res.end('Liked successfully');
        })
        p2.catch(err=> {
          console.log('Error saving when liking on post')
          res.end('failed save on like post')
        })
        console.log('Unliked post!');
      }
    } else {
      res.end('Could not find post to like on');
    }
  });
  p1.catch( (error) => {
    console.log('finding posts when liking failed');
    res.end('finding posts when liking failed');
  });
});
/**
 * This route is for getting the all the posts of socialite 
 */
app.get('/posts/', (req, res) => {
  let p1 = Post.find({}).exec();
  
  p1.then( (results) => { 
    res.end( JSON.stringify(results) );
  });
  p1.catch( (error) => {
    console.log(error);
    res.end('FAIL');
  });
});

/**
 * This route is for getting the posts for the user 
 */
app.get('/posts/:user', (req, res) => {
  let p1 = Post.find({username:req.params.user}).exec();
  p1.then( (results) => { 
    res.end( JSON.stringify(results) );
  });
  p1.catch( (error) => {
    console.log(error);
    res.end('FAIL');
  });
});

/**
 * This route is for creating a post (use an image to create a post) 
 */
app.post('/create/post/', upload.single("postImage"), (req, res) => {
  let PostToSave = {username: req.body.username, text: req.body.postText, image: getImgRoute(req.file.path)};

  //find avatar of user
  let p2 = User.find({username:req.body.username}).exec();
  p2.then( (results) => { 
    PostToSave.avatar = results[0].img;
    var newPost = new Post(PostToSave);
    newPost.dateCreated = new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    let p1 = newPost.save();
    p1.then( (doc) => { 
      res.end('POST SAVED SUCCESFULLY');
    });
    p1.catch( (err) => { 
      console.log(err);
      res.end('FAILED TO CREATE A POST');
    });
  });
});

/**
 * This route is for getting a users profile
 */
app.get('/profile/:user', (req, res) => {
  let p1 = User.find({username:req.params.user}).exec();

  p1.then( (results) => { 
    //console.log(results[0].username);
    res.end( JSON.stringify(results) );
    
  });
  p1.catch( (error) => {
    console.log("error while finding profile metadata");
    res.end('FAIL');
  });
});

/**
 * This route is for creating a new comment
 */
app.get('/create/comment/:postid', (req, res) => {
  let p1 = Post.find({_id: req.body.postid}).exec();
  p1.then( (results) => { 
    if (results.length > 0) {
      res.end('That username is already taken.');
    } else {

      let newSalt = Math.floor((Math.random() * 1000000));
      let toHash = req.body.passwordCreate + newSalt;
      var hash = crypto.createHash('sha3-256');
      let data = hash.update(toHash, 'utf-8');
      let newHash = data.digest('hex');
      let email = req.body.emailCreate;
      let bio = req.body.bioCreate;

      var newUser = new User({ 
        username: req.body.usernameCreate,
        salt: newSalt,
        hash: newHash,
        email:email,
        bio:bio,
        img: getImgRoute(req.file.path)
      });
      newUser.save().then( (doc) => { 
          res.end("A new account has been created!")
        }).catch( (err) => { 
          console.log(err);
          res.end('Failed to create new account.');
        });
    }
  });
  p1.catch( (error) => {
    res.end('Failed to create new account.');
  });
});


/**
 * This route is for creating a new user account.
 */
app.post('/account/create/', upload.single("avatar"), (req, res) => {
  let p1 = User.find({username: req.body.usernameCreate}).exec();
  p1.then( (results) => { 
    if (results.length > 0) {
      res.end('That username is already taken.');
    } else {

      let newSalt = Math.floor((Math.random() * 1000000));
      let toHash = req.body.passwordCreate + newSalt;
      var hash = crypto.createHash('sha3-256');
      let data = hash.update(toHash, 'utf-8');
      let newHash = data.digest('hex');
      let email = req.body.emailCreate;
      let bio = req.body.bioCreate;

      var newUser = new User({ 
        username: req.body.usernameCreate,
        salt: newSalt,
        hash: newHash,
        email:email,
        bio:bio,
        img: getImgRoute(req.file.path)
      });
      newUser.save().then( (doc) => { 
          res.end("A new account has been created!")
        }).catch( (err) => { 
          console.log(err);
          res.end('Failed to create new account.');
        });
    }
  });
  p1.catch( (error) => {
    res.end('Failed to create new account.');
  });
});

/**
 * Process a user login request.
 */
app.get('/account/login/:username/:password', (req, res) => {
  let u = req.params.username;
  let p = req.params.password;
  let q = req.params.email;
  let r = req.params.city;
  let p1 = User.find({username:u}).exec();
  p1.then( (results) => { 
    if (results.length == 1) {

      let existingSalt = results[0].salt;
      let toHash = req.params.password + existingSalt;
      var hash = crypto.createHash('sha3-256');
      let data = hash.update(toHash, 'utf-8');
      let newHash = data.digest('hex');
      
      if (newHash == results[0].hash) {
        let id = cm.sessions.addOrUpdateSession(u);
        //delete cookies after max age milisecs
        res.cookie("login", {username: u, sid: id}, {maxAge: 60 * 60 * 1000});
        res.end('SUCCESS');
      } else {
        res.end('password was incorrect');
      }
    } else {
      res.end('login failed');
    }
  });
  p1.catch( (error) => {
    res.end('login failed');
  });
});
/**
 * This route is used for getting the chats of the global messenger app
 */
app.get('/chats', (req, res) => {

  let p1 = Item.find({}).exec();
  p1.then ((results) => {
    let resultString = '';
    for (i in results){
      resultString += "<div class=msgAlias>" + results[i].alias + "</div>" +
      "<div class=msgText>" + results[i].message + "</div>";
    }
    res.end(resultString);
  });
  p1.catch((error) =>{
    console.log(error);
    res.end("fail");
  });
});
/**
 * This route is used for getting the chats of the global messenger app
 */
app.post('/chats/post', parser.json(),(req, res) => {
    console.log(req.body);
    let n = req.body.alias;
    let s = req.body.message;
    var newItem = new Item({
      alias:n,
      message:s,
    //stat:s,
    });
    let p1 = newItem.save();
    p1.then((doc) => {
      res.send('Saved succesfully');
    });
    p1.catch((err) => {
      console.log(err);
      res.send('Fail');
    });
  });

  /**
 * This function is used for getting the image routes 
 */
  function getImgRoute(inputString) {
    if(inputString.includes('/')) {
      const pattern = /uploads\/\d+\.\w+$/;
      const match = inputString.match(pattern);
  
      return match ? match[0] : null;
    }
    else {
      const regex = /uploads\\[\w.-]+/g;
      const match = inputString.match(regex);
      if (match) {
        return match[0];
      }
      else {
        return null;
      }
    }
      
   }
/**
 * This route is used for  Returning just one user with matching username
 */
  
  app.get('/users/:username', (req, res) => {
    let p1 = User.find({username:req.params.username}).exec();
    p1.then((results) => {
      res.json(results[0]);
    });
    p1.catch((error) => {
      console.log(error);
      res.status(500).send('Error retrieving users.');
    });
  });

/**
 * This route is used for  Returning Return all users currently registered on Socialite */
  app.get('/users', (req, res) => {
    let p1 = User.find({}).exec();
    p1.then((results) => {
      const users = results.map((user) => ({
        username: user.username,
        img: user.img,
      }));
      res.json(users);
    });
    p1.catch((error) => {
      console.log(error);
      res.status(500).send('Error retrieving users.');
    });
  });

  // Return all users currently registered on Socialite
  app.get('/followed/:userID', (req, res) => {
    let p1 = User.find({}).exec();
    p1.then((results) => {
      const users = results.map((user) => ({
        username: user.username,
        img: user.img,
      }));
      res.json(users);
    });
    p1.catch((error) => {
      console.log(error);
      res.status(500).send('Error retrieving users.');
    });
  });

  
  // Create friendship between two users
  app.post('/followUser', async function(req, res) {
    const userID = req.body.user;
    const friendID = req.body.friend;
  
    try {
      // Find User objects for current user and user to be followed
      const user = await User.findOne({ username: userID }).exec();
      const friend = await User.findOne({ username: friendID }).exec();
  
      if (!user || !friend) {
        throw new Error('Invalid user or friend ID');
      }
  
      const isFollowing = user.following.includes(friend._id);
      if (isFollowing === false) {
        // Add friend ID to user's following list
        user.following.push(friend._id);
    
        // Save changes to database
        await user.save();
    
        console.log(`${user.username} is now following ${friend.username} on Socialite.`);
        res.status(200).send('Friend added!');
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Error following user');
    }
  });

/**
 * This route is used for determining if two users follow each other */
  app.post('/isFollowing', async function(req, res) {
    const userID = req.body.user;
    const friendID = req.body.friend;
  
    try {
      // Find User objects for current user and friend to be added
      const user = await User.findOne({ username: userID }).exec();
      const friend = await User.findOne({ username: friendID }).exec();
  
      if (!user || !friend) {
        throw new Error('Invalid user or friend ID');
      }
  
      const isFollowing = user.following.includes(friend._id);

      res.status(200).json({ isFollowing });
      
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error showing following status to ${friendID.username}`);
    }
  });
        

// Start up the server to listen on port 80
const port = 3000;
app.listen(port, () => { console.log('server has started'); });