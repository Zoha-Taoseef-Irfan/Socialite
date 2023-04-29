# Socialite


CSC337 Web Programming Final Project

Team Members: Taoseef Aziz, Amimul Ehsan Zoha, Irfan Ahmad

# Overview

The app will be a social networking web app, similar to that of Facebook. 
The app will have the primary functionality in which the users can create accounts and login to their individual accounts. For login, there will be some sort of authentication mechanism. Once a user logs in, he will be assigned a session and cookies will be used to keep track of a time after which his session will be over and redirected to the login page. After logging in, the user will be redirected to the home page, which will be similar to that of a facebook / twitter timeline. The home page will contain contents like the timeline of recent posts (of all users), and each post will have the option to be liked and commented on. There will be the option to upload images in a post. Users can be friends with each other. Users will be able to chat amongst themselves by the use of the messaging feature of the social media web app.

In a nutshell, our social media web app, users will be able to chat amongst themselves, interact with other users, create and like posts, and add other users as friends. The site will serve to be a hub for transitioning between whatever a user would like to do, whether that be messaging, posting, or viewing content. 

# Frontend

# Pages:
Landing page, (login/register)
Home page: 
Shows posts globally by default (with comments)
Can toggle to show friends only posts
Go to Chatroom button
Friends list button
Profile page
Friends page (add remove friends)
Search for users
Global chatroom page

# Backend

Schemas:
The user schema has information such as the user's name, an alphanumeric username, a hashed password, and salt. The system may use the crypto module to generate a hash for added security. The user's status can be updated at regular intervals using setInterval(). The Friends attribute stores a list of user objects, allowing users to keep track of their connections. The Profile pic attribute stores the user's uploaded image.
User: Stores user information including their name, hashed password, salt.
Username: alphanumeric
Hash: Possibly, we would want to make use of the crypto module for this
Salt: (likewise)
Status (kept up to date with setInterval?)
Friends: List of user objects, append user to list whenever a new friend is made
Profile pic: image that is uploaded
A post has information such as text, images, the date the post was created, a list of comments made by other users, and the number of likes the post has received. These components allow users to create and share content with others on the platform, engage in discussions through comments, and express their approval through likes.
Post: Contains information for user-generated posts, which can include text, images, comments, and likes.
Text 
Image
Time
DateCreated
Comments (a list of strings)
Likes
A message object has the text of the message, the sender of the message, and the time at which the message was sent. These attributes allow the messaging system to keep track of and display message content and metadata, such as who sent the message and when it was sent.
Message(Text): Stores information about messages including the text, sender, and time.
Text
Sender
Time
A chatroom object includes a list of message IDs, which can be used to retrieve the content of each message. The chatroom allows authenticated users to send messages and participate in conversations. This schema allows for a single chatroom to be used by all users, providing a centralized location for global messages and facilitating communication between users.
Chatroom-Generic (possibly): Contains all global messages from users and allows for messages to be sent.
Messages (ids)
Authenticated Users
# Routes:
/get/profile
/get/posts (for a certain user)
/get/friends ('')
/get/chatrooms ('')
/get/chats (for a chatroom)
/post/post (lol)
/login/user
/register/user (create profile using this)
/post/comment
/post/like??
 
npm Modules:
Express
Mongoose
cookie-parser

Timeline

3 hour in-person meetings on each of the days detailed for both working on code, handling merge conflicts and for scrum-style meetings. Each scrum meeting, we will update our backlog, create new user-stories, and update the retrospective.

9th Apr (Sun): Setup git repo, do init push of hello world NodeJS and express, setup Jira and user stories and backlog. 
11th Apr: 
15th Apr: Landing page, and weather user login/ reg, cookies & sessions.
16th Apr (Sun)
18th Apr: All of the mongoDB schemas and Home page UI. 

