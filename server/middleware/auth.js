const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  if (Object.keys(req.cookies).length === 0) {
    models.Sessions.create()
      .then((data) => {
        console.log('models session create data', data);
        // created a session
        // grab userID from user table
        // add userID to sessions table
        // assign an object to session property on request that contains relevant user info

        var username = req.body.username;
        return models.Users.get({username})
          .then(results => {
            var userId = results.userId;
            return models.Sessions.update({userId: null}, {userId});
          })
          .then(() => {

          })
          .catch(err => {
            throw err;
          });
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

