
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  random: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  m1quiz:{
    type:Boolean,
    required: false
    
  },
  m1quiztime:{
    type: Date,
    required: false
  },
  m1reading:{
    type:Boolean,
    required: false
  },
  m1readingtime:{
    type: Date,
    required: false
  }

});

//authenticate input against data base

UserSchema.statics.checkQuizRecord = function checkRecord(quizId, userId, callback){
    User.findById(userId)
    .exec(function (error, user){
      if (error){
        return next(error);
      } else {
        callback(null, user[quizId]);
      }
    });
  }

UserSchema.statics.authenticate = function(email, password, callback){
  User.findOne({email: email})
    .exec(function (error, user){
      if (error){
        return callback(error);
      } else if (!user){
        var err = new Error('No such user!');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(error, result){
        if (result === true){
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hash password
UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if (err){
			return next(err);
		} 
		user.password = hash;
		next();
	})
});

var User = mongoose.model('User', UserSchema);
module.exports = User;