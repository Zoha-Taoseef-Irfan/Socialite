
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
