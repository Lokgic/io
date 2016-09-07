var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var RecordSchema = new Schema({
  name: String,
  score:  Number,
},
{ timestamps: { createdAt: 'created_at' }}
);


var LeaderSchema = new Schema({
    game: {
      type: String,
      required: true,
      trim: true,
    },
    
  record: [RecordSchema]
});


LeaderSchema.statics.getRanking = function getRanking(game, callback){
  Leader.findOne({game: game})
    .exec(function (error, leaderboard){
      if (leaderboard == null){
        return null;
      } else {
          return callback(null, leaderboard.record);
      }

    })

}

LeaderSchema.statics.update  = function update(name, game, score, callback){
	 Leader.findOne({game: game})
	 	.exec(function (err, leaderboard){
	 	if (leaderboard == null){
	 		var rec = {}
	        rec.score = score;
	        rec.name = name;
	 		var r = []
	 		r.push(rec);
	 		var gameData = {
	 			game: game,
	 			record: r
	 		}
	 		Leader.create(gameData);
	 		return callback(null, "created");

	 	}else{
	 		var boardLength = 20;
	 		var rec = {}
        	rec.score = score;
        	rec.name = name;
		 	if (leaderboard.record.length < boardLength){
		 		leaderboard.record.push(rec);
		 		leaderboard.record.sort(function(a,b){
		 							if (a.score > b.score){
										return -1;
									}else if (b.score>a.score){
										return 1;
									} else{
										return 0;
									}
								})
	        	leaderboard.save();
	        	return callback(null, "added because less than 10");
		 		}else{
		 			// scores = [];
		 			// for (var i = 0; i <boardLength;i++ ){
		 			// 	// console.log(leaderboard.record[i].score)
		 			// 	scores.push(leaderboard.record[i].score);
		 			// }
		 			// scores.sort();
		 			// console.log(scores);
		 				var min = leaderboard.record[leaderboard.record.length - 1].score;
		 				console.log(min)
		 			if (min < score){
		 				// for (unit in leaderboard.record){
		 				// 	if(leaderboard.record[unit].score === min){
		 				// 		leaderboard.record.splice(unit,1);
		 				// 		leaderboard.record.push(rec);
		 				// 		leaderboard.record.sort(function(a,b){
		 				// 			if (a.score > b.score){
							// 			return -1;
							// 		}else if (b.score>a.score){
							// 			return 1;
							// 		} else{
							// 			return 0;
							// 		}
							// 			 						}
		 				// 			)
					  //       	leaderboard.save();
					  //       	return callback(null, "added because higher");
		 				// 	}
		 				// }
		 				leaderboard.record.pop();
		 				leaderboard.record.push(rec);
		 				leaderboard.record.sort(function(a,b){
		 							if (a.score > b.score){
										return -1;
									}else if (b.score>a.score){
										return 1;
									} else{
										return 0;
									}
								})
		 				leaderboard.save();
		 				return callback(null,"added because higher")

		 			}else{
		 			return callback(null, "score not high enough")
		 		}
		 		}
		 	

	 	}
	 	

	 	
	 })
}



var Leader = mongoose.model('Leader', LeaderSchema);
module.exports = Leader;