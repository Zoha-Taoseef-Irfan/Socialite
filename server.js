const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');
const cm = require('./customsessions');

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
  city:String,
  //friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [Number], //mongodb ids of this users friend
  img:
  {
      data: Buffer,
      contentType: String
  } // https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
});

var User = mongoose.model('User', UserSchema);

// schema for each post 
var PostSchema = new mongoose.Schema( {
  username: String,
  text: String,
  image: {
    data: Buffer,
    contentType: String 
  },
  //time: String, // maybe we should avoid this and just have the data functionality if date obj can somehow give us the time
  dateCreated: String,
  comments: [String],
  likes: { type: Number, default: 0 }
});

var Post = mongoose.model('Post', PostSchema);

var messageSchema = new mongoose.Schema({
  alias: String,    
  message: String,
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

app.post('/create/post/', (req, res) => {
  let PostToSave = req.body;
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

/**
 * This route is for creating a new user account.
 */
app.get('/account/create/:username/:password/:email/:city', (req, res) => {
  let p1 = User.find({username: req.params.username}).exec();
  p1.then( (results) => { 
    if (results.length > 0) {
      res.end('That username is already taken.');
    } else {

      let newSalt = Math.floor((Math.random() * 1000000));
      let toHash = req.params.password + newSalt;
      var hash = crypto.createHash('sha3-256');
      let data = hash.update(toHash, 'utf-8');
      let newHash = data.digest('hex');
      let email = req.params.email;
      let city = req.params.city;

      var newUser = new User({ 
        username: req.params.username,
        salt: newSalt,
        hash: newHash,
        email:email,
        city:city
      });
      newUser.save().then( (doc) => { 
          res.end('Created new account!');
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

// Start up the server to listen on port 80
const port = 3000;
app.listen(port, () => { console.log('server has started'); });

