/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  beforeCreate: function (attrs, next) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function(err, hash) {
        if (err) return next(err);

        attrs.password = hash;
        next();
      });
    });
  },  

  attributes: {

    firstName: {
      type: 'string'
    },

    lastName: {
      type: 'string'
    },

    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true,
      minLength: 6
    },

    /**
     * Custom toJSON() implementation. Removes unwanted attributes.
     */
     
    toJSON: function() {
      var user = this.toObject();
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;
      return user;
    },

  },

  /**
   * Get user's full name
   */
  fullName: function() {
    return _.compact([this.firstName, this.lastName]).join(' ');      
  },

  // Validation Messages
  validation_messages: {
  
      email: {
          required: 'Email required',
          unique: 'Email is already in use',
          email: 'Email format incorrect'
      },
      
      password: {
        required: 'Password required',
        minLength: 'Password must contain 6 characters'
      }
      
  },

};

