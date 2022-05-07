const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  var newSession = (req, res, next) => {
    return models.Sessions.create()
      .then((data) => {
        // console.log('models session create data', data);
        // created a session
        // grab userID from user table
        // add userID to sessions table
        // assign an object to session property on request that contains relevant user info
        var sessionId = data.insertId;
        var username = req.body.username;
        var user = {username};
        return models.Users.get({username})
          .then(results => {
            if (results) {
              var userId = results.id;
              return models.Sessions.update({id: sessionId}, {userId});
            } else {
              var userId = null;
            }
          })
          .then(() => {
            return models.Sessions.get({id: sessionId});
          })
          .then(results => {
            req.session = JSON.parse(JSON.stringify(results));
            req.session.user = user;
            res.cookie('shortlyid', results.hash);
            next();
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  };


  if (req.cookies.shortlyid === undefined) {
    return newSession(req, res, next);
  } else {
    var hash = req.cookies.shortlyid;
    return models.Sessions.get({hash})
      .then(results => {
        if (results) {
          req.session = JSON.parse(JSON.stringify(results));
          res.cookie('shortlyid', results.hash);
          if (results.userId !== null) {

            return models.Users.get({id: results.userId})
              .then(data => {
                var user = {username: data.username};
                req.session.user = user;
                next();
              })
              .catch(err => {
                throw err;
              });
          }
          next();
        } else {
          return newSession(req, res, next);
        }
      })
      .catch(err => {
        throw err;
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  if (models.Sessions.isLoggedIn(req.session)) {
    next();
  } else {
    res.redirect('/login');
    res.end();
  }
};