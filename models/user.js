
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
    default: false,
    required: false
    
  },
  m1quiztime:{
    type: Date,
    required: false
  },
  m1reading:{
    type:Boolean,
    default: false,
    required: false
  },
  m1readingtime:{
    type: Date,
    required: false
  },
  m1test:{
    type: Boolean,
    default: false,
    required: false

  },
  m1ass:{
    type: Boolean,
    default: false,
    required: false

  },
  m2quiz:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m2ass:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m2quiztime:{
    type: Date,
    required: false
  },
  m2reading:{
    type:Boolean,
    default: false,
    required: false
  },
  m2readingtime:{
    type: Date,
    required: false
  },
  m2test:{
    type: Boolean,
    default: false,
    required: false

  },
  m3ass:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m3quiz:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m3quiztime:{
    type: Date,
    required: false
  },
  m3reading:{
    type:Boolean,
    default: false,
    required: false
  },
  m3readingtime:{
    type: Date,
    required: false
  },
  m3test:{
    type: Boolean,
    default: false,
    required: false

  },
  m4quiz:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m4quiztime:{
    type: Date,
    required: false
  },
  m4reading:{
    type:Boolean,
    default: false,
    required: false
  },
  m4readingtime:{
    type: Date,
    required: false
  },
  m4ass:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m4test:{
    type: Boolean,
    default: false,
    required: false

  },
  m5quiz:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m5ass:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m5quiztime:{
    type: Date,
    required: false
  },
  m5reading:{
    type:Boolean,
    default: false,
    required: false
  },
  m5readingtime:{
    type: Date,
    required: false
  },
  m5test:{
    type: Boolean,
    default: false,
    required: false

  },
  m6ass:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m6quiz:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m6quiztime:{
    type: Date,
    required: false
  },
  m6reading:{
    type:Boolean,
    default: false,
    required: false
  },
  m6readingtime:{
    type: Date,
    required: false
  },
  m6test:{
    type: Boolean,
    default: false,
    required: false

  },
  m7ass:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m7quiz:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m7quiztime:{
    type: Date,
    required: false
  },
  m7reading:{
    type:Boolean,
    default: false,
    required: false
  },
  m7readingtime:{
    type: Date,
    required: false
  },
  m7test:{
    type: Boolean,
    default: false,
    required: false

  },
  m8quiz:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m8ass:{
    type:Boolean,
    default: false,
    required: false
    
  },
  m8quiztime:{
    type: Date,
    required: false
  },
  m8reading:{
    type:Boolean,
    default: false,
    required: false
  },
  m8readingtime:{
    type: Date,
    required: false
  },
  m8test:{
    type: Boolean,
    default: false,
    required: false

  }

});

//authenticate input against data base

UserSchema.statics.checkQuizRecord = function checkRecord(recordId, userId, callback){
    User.findById(userId)
    .exec(function (error, user){
      if (error){
        return next(error);
      } else {
        callback(null, user[recordId]);
      }
    });
  }

UserSchema.statics.reportCard = function reportCard(userId, callback){
    User.findById(userId)
    .exec(function (error, user){
      if (error){
        return next(error);
      } else {
        var report = {
          "0": {
          },
          "1": {
            "reading": false,
            "quiz": false,
            "test": false,
            "ass": false,
          },
          "2": {
            "reading": false,
            "quiz": false,
            "test": false
          },
          "3": {
            "reading": false,
            "quiz": false,
            "test": false
          },
          "4": {
            "reading": false,
            "quiz": false,
            "test": false
          },
          "5": {
            "reading": false,
            "quiz": false,
            "test": false
          },
          "6": {
            "reading": false,
            "quiz": false,
            "test": false
          },
          "7": {
            "reading": false,
            "quiz": false,
            "test": false
          },
          "8": {
            "reading": false,
            "quiz": false,
            "test": false
          }
        }
        for (var i = 1; i<9; i++){
          var n = "m"+i;
          var quiz = n +"quiz";
          var reading = n + "reading";
          var test = n + "test";
          var ass = n + "ass";
          if (user[quiz]) report[i].quiz = true;
          if (user[reading]) report[i].reading = true;
          if (user[test]) report[i].test = true;
          if (user[ass]){
            report[i].ass = true;
          } else {
            report[i].ass = false;
          }
        }
        report[0].name = user.name;
        report[0].random = user.random;
        callback(null, report);
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