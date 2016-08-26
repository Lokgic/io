
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
  record: [RecordSchema]
});



UserSchema.statics.record = function record(userId, moduleNo, label, callback){
    User.findById(userId)
    .exec(function (error, user){
      if (error){
        return next(error);
      } else {
        var query = {};
        console.log(moduleNo);
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
//   module: {
//     "1": {
//      "reading": {
//         "passed": {type: Boolean,required: false, default :false} ,
//         "time": {type: Date,required :false, default: null},
//         "section":{
//           "I":{
//             "passed": {type: Boolean,required: false, default :false},
//           "time": {type: Date,required :false, default: null}
//           },
//           "II":{
//             "passed": {type: Boolean,required: false, default :false},
//           "time": {type: Date,required :false, default: null}
//           }
//         },
//       },
//     "quiz": {
//      "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "ass": {
//      "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "test": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     }
//   },
//   "2": {
//     "reading": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "quiz": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "ass": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "test": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     }
//   },
//   "3": {
//     "reading": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "quiz": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "ass": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "test": {
//      "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     }
//   },
//   "4": {
//     "reading": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "quiz": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "ass": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "test": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     }
//   },
//   "5": {
//     "reading": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "quiz": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "ass": {
//     "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "test": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     }
//   },
//   "6": {
//     "reading": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "quiz": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "ass": {
//      "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "test": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     }
//   },
//   "7": {
//     "reading": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "quiz": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "ass": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "test": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     }
//   },
//   "8": {
//     "reading": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "quiz": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "ass": {
//      "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     },
//     "test": {
//       "passed": {type: Boolean,required: false, default :false} ,
//       "time": {type: Date,required :false, default: null}
//     }
//   }
// }



//authenticate input against data base

// UserSchema.statics.checkRecord = function checkRecord(moduleNo, type, userId, callback){

      

//     User.findById(userId)
//     .exec(function (error, user){
//       if (error){
//         return next(error);
//       } else {
//         if (typeof type == 'object'){
//           var typename = type.name;
//           var section = type.section;
//           console.log(typename + section);
//           callback(null, user.module[moduleNo][typename].section[section].passed);
//         } else callback(null, user.module[moduleNo][type].passed);
//       }
//     });
//   }

// UserSchema.statics.reportCard = function reportCard(userId, callback){
//     User.findById(userId)
//     .exec(function (error, user){
//       if (error){
//         return next(error);
//       } else {       
//         var report = {};
//         var modules = {};
//         for (var i =1; i<9;i++){
//           modules[i] = user.module[i];
          
//         }

//         report.modules = modules;
//         report.name = user.name;
//         report.random = user.random;
//         callback(null, report);
//       }
//     });
//   }

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