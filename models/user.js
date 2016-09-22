
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var RecordSchema = new Schema({
  moduleNo:  Number,
  label: String,
  section: String,
},
{ timestamps: { createdAt: 'created_at' }}
);

var UserSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
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
  box: {
    type: String,
    required: false
  },
  record: [RecordSchema]
});



function gatherData(email, callback){
  User.findOne({email: email})
    .exec(function (error, user){
      return callback(user.record.length);
      // console.log(scores);
    })
}

UserSchema.statics.getOverall = function (email, callback){
  User.findOne({email: email})
    .exec(function (error, user){
      return callback(user.record.length);
      // console.log(scores);
    })
  }


UserSchema.statics.record = function record(userId, moduleNo, label, callback){
    User.findById(userId)
    .exec(function (error, user){
      if (error){
        return next(error);
      } else {
        var query = {};
        for (var i = 0; i <user.record.length;i++){
            if(user.record[i].label == label && user.record[i].moduleNo == moduleNo){
              // console.log(user.record[i].label);
              // console.log(user.record[i].moduleNo);
                return callback(null, "No change was made to your record since you had already completed this task, but hey - you still got it!")
            }
        }
        var rec = {}
        rec.moduleNo = moduleNo;
        rec.label = label;
        user.record.push(rec);
        user.save();
        return callback(null, "Your record has been updated.")
      }
    });
  }


UserSchema.statics.getName = function getName(userId, callback){
  User.findById(userId)
    .exec(function (error, user){
      if (error){
        return next(error);
      } else {




          return callback(null, user.name);
      }

    })

}

UserSchema.statics.getProfile = function getProfile(userId, callback){
  User.findById(userId)
    .exec(function (error, user){
      if (error){
        return next(error);
      } else {



          return callback(null, user);
      }

    })

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
  console.log(user.record.length);
  if (user.record.length == 0){
	bcrypt.hash(user.password, 10, function(err, hash){
		if (err){
			return next(err);
		}
		user.password = hash;
		next();
	})}else{
    next();
  }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
