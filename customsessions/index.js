/*
Authors: Amimul Ehsan Zoha, Taoseef Aziz, Irfan Ahmad
Course: CS337 Spring 2023
Project: Socialite Social Media

Description:
This is a JavaScript class named CustomSessions that provides methods for managing user sessions. 
It has a sessions object and a SESSION_LENGTH property that determines how long a session will last.
The class has an addOrUpdateSession method that takes a user as input and generates a random sessionId. 
It updates the start time for the user's session if it already exists, or creates a new session with the generated sessionId and start time.
The doesUserHaveSession method takes a user and sessionId as input and checks if the user has a session with the specified sessionId.
The cleanupSessions method is responsible for removing expired sessions. It iterates through all the sessions and removes sessions for users whose start time is older than SESSION_LENGTH.
Lastly, the startCleanup method uses the setInterval function to execute the cleanupSessions method every 2 seconds to continuously clean up expired sessions.
The code exports an instance of the CustomSessions class, making it accessible to other parts of the application that require session management.
*/

class CustomSessions {

  sessions = {};
  SESSION_LENGTH =  60 * 60 * 1000;

  constructor() { }

  addOrUpdateSession(user) {
    let sessionId = Math.floor(Math.random() * 100000);
    let sessionStart = Date.now();
    if (user in this.sessions) {
      this.sessions[user].start = sessionStart;
    } else {
      this.sessions[user] = { 'sid': sessionId, 'start': sessionStart };
    }
    return sessionId;
  }

  doesUserHaveSession(user, sessionId) {
    let entry = this.sessions[user];
    if (entry != undefined) {
      return entry.sid == sessionId;
    }
    return false;
  }

  cleanupSessions() {
    let currentTime = Date.now();
    for (i in this.sessions) {
      let sess = this.sessions[i];
      if (this.SESSION_LENGTH < currentTime - sess.start) {
        console.log('removing session for user: ' + i);
        //delete this.sessions[i];
      }
      else {
        console.log('keeping session for user: ' + i);
      }
    }
  }

  startCleanup() {
    setInterval(this.cleanupSessions, 2000);
  }
}

exports.sessions = new CustomSessions();
