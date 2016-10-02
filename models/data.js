var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VariableSchema = new Schema({
    id: {
      type: String,
      required: true,
      trim: true,
    },
    section:{
      type: String,
      required: true,
      trim: true
    },
    correct:{
      type: Number
    },
    total:{
      type:Number
    },
  data: [DataPointSchema]
});

var DataPointSchema = new Schema({
  user: String,
  correct: Boolean,
},
{ timestamps: { createdAt: 'created_at' }}
);


VariableSchema.statics.update  = function update(id, correct, callback){
	 Leader.findOne({id: id})
	 	.exec(function (err, variable){


    })}
