// var Chance = require('chance')
// var chance = new Chance()
var _ = require('underscore')
var pg = require('pg')

pg.defaults.ssl = (process.env.test)? false : true
pgurl = (process.env.test)?'postgres://localhost:5432/lok':process.env.DATABASE_URL

console.log(pgurl)
//pq connection
var knex = require('knex')({
  client: 'postgresql',
  connection: pgurl,
  searchPath: 'knex,public'
});



module.exports.getProfile = function(uid, callback){

	knex.select().from('record').where({'uid':uid})
      .catch(function(error) {
        console.log(error)
        return callback(error)
      })
      .then(function(tab){
        var toSend = {
          "sl":[],
          "pl":[],
          "nd":[],
          "id":[],
          "pa":[]
        }
        for (datapoint in tab){
          toSend[tab[datapoint].module].push(tab[datapoint])
        }

        return callback(toSend)
        })

      }



module.exports.attempt = function(dataset, callback){

	knex('attempt').insert(dataset)
      .catch(function(error) {
        return callback(error)
      })
      .then(function(){
        return callback(null,"recorded")
        })

      }

module.exports.record = function(record, callback){

	knex('record').insert(record)
      .catch(function(error) {
        console.log(error)
        return callback(error)
      })
      .then(function(){
        return callback(null,"recorded")
        })

      }


module.exports.leader = function(lead, callback){

	knex('leader').insert(lead)
      .catch(function(error) {
        console.log(error)
        return callback(error)
      })
      .then(function(){
        return callback(null,"recorded")
        })

      }


module.exports.getRanking = function(name, callback){

	knex.select('student.nickname','leader.score').from('leader').innerJoin('student','student.uid','leader.uid').orderBy('score','desc')
      .catch(function(error) {
        console.log(error)
        return callback(error)
      })
      .then(function(tab){
        return callback(tab)
        })

      }
