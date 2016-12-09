var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TestingDataSchema = new Schema({
    id: {
    type: String,
    required: true,
    trim: true,
    },
    mid: {
      type: String,
      required: true,
      trim: true,
    },
    tid:{
      type: String,
      required: true,
      trim: true
    },
  data: []
});



TestingDataSchema.statics.update  = function update(moduleNum, tid, datapoint, callback){
  id = moduleNum+tid

	 TestingData.findOne({id: id})
	 	.exec(function (err, test){
      if (test == null){
        var newDP = {}
        newDP.id = id
        newDP.mid = moduleNum
        newDP.tid = tid
        newDP.data = [datapoint]
        console.log(newDP)
        TestingData.create(newDP)
        return callback(null,"new test created")
      } else{
        test.data.push(datapoint)
        test.save();
        return callback(null, "data saved")
      }


    })}

var TestingData = mongoose.model('TestingData', TestingDataSchema);
module.exports = TestingData;
