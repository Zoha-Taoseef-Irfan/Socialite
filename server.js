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

app.get('/profile/:user', (req, res) => {
  //console.log("this is the req . param . user----" + req.params.user);
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
 * This route is for creating a new user account.
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

app.get('/chats', (req, res) => {

  let p1 = Item.find({}).exec();
  p1.then ((results) => {
    let resultString = '';
    for (i in results){
      resultString += "<b>" + results[i].alias + "</b>" + ": " +
      results[i].message + '<br>';
    //   results[i].stat  + // do time here 
    }
    res.end(resultString);
  });
  p1.catch((error) =>{
    console.log(error);
    res.end("fail");
  });
});

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


  // Return all users currently registered on Socialite
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

  // Return all users that are being followed
  app.get('/followed/:userID', async (req, res) => {
    const userID = req.params.userID;
    try {
      const user = await User.findOne({ username: userID });
      console.log("USERNAME: "  + user);
      const followedUsers = [];
      for (let i = 0; i < user.following.length; i++) {
        followedUsers.push(user.following[i]);
      }

      const test = await User.findOne({ _id : followedUsers[0] });
      console.log("Test Object: "  + test);
      res.json(test);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving followed users.');
    }
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
        
  // ***CLEAR EXISTING DATABASE***
  // async function deleteAllData() {
  //   try {
  //     await Post.deleteMany({});
  //     await User.deleteMany({});
  //     console.log('All data deleted successfully.');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  
  // deleteAllData();

// Start up the server to listen on port 80
const port = 3000;
app.listen(port, () => { console.log('server has started'); });