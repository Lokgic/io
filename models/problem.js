// var Chance = require('chance')
// var chance = new Chance()
var _ = require('underscore')
var pg = require('pg')

pg.defaults.ssl = (process.env.test)? false : true
pgurl = (process.env.test)?'postgres://localhost:5432/lok':process.env.DATABASE_URL
// console.log(process.env.test)
//pq connection
var knex = require('knex')({
  client: 'postgresql',
  connection: pgurl,
  searchPath: 'knex,public'
});






module.exports.get = function(mod, chapter,section, callback){

	knex.select().from('problem').where("module",mod).where('chapter',chapter).where('section',section)
  .catch(function(error) {
    console.log(error)
    return callback(error)
  })
  .then(function(d){
    if (d.length == 0){
      console.log("nothing came up!")
  		var err = new Error('nothing came up!');
          err.status = 401;
          return callback(err);
    }else{
      if (section == "def"){
        var defPool = [];
        for (def in d){
          defPool.push(d[def].answer)
        }

        for (def in d){
          // console.log(defPool)
          // console.log(def.answer)
          d[def].question = [d[def].question]
          d[def].options = _.sample(_.without(defPool,d[def].answer),3)
          d[def].options.push(d[def].answer)
          d[def].options = _.shuffle(d[def].options)
        }
      }

      if (section == "cat"){
        var toSend = []
        var choices = []
        for (problem in d){
          var toPush = {
            pid:d[problem].pid,
            question:d[problem].question,
            answer: d[problem].answer
          }
          console.log(toPush.answer)
          if (!_.contains(choices,toPush.answer)) choices.push(toPush.answer)
          toSend.push(toPush)
        }

        toCall= {
          choices: choices,
          problems:toSend
        }
        return callback(toCall)
      }

      // console.log(d)
      return callback(_.shuffle(d))
    }

  })
}
