/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

create: function(req, res) {
  
    var newUser = {};
    
    newUser.firstName = req.query.firstName;
    newUser.lastName = req.query.lastName;
    newUser.email = req.query.email;
    newUser.password = req.query.password;
    
    User.create(newUser).exec(function(err, user) {
    
      if (err) {
      
          if (err.ValidationError) {
          
              errors = HandleValidation.transformValidation(User, err.ValidationError);
              return res.json({
                  success:false,
                  errors: errors
              });
              
          } else {
            return res.json(err.status, {err: err});
          }
          
      }
      
      return res.json({ user: user });
      
    });

  },

  login: function (req, res) {
    var bcrypt = require('bcrypt');

    User.findOneByEmail(req.body.email).done(function (err, user) {
      if (err) res.json({ error: 'DB error' }, 500);

      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, match) {
          if (err) res.json({ error: 'Server error' }, 500);

          if (match) {
            // password match
            req.session.user = user.id;
            res.json(user);
          } else {
            // invalid password
            if (req.session.user) req.session.user = null;
            res.json({ error: 'Invalid password' }, 400);
          }
        });
      } else {
        res.json({ error: 'User not found' }, 404);
      }
    });
  }
	
};

