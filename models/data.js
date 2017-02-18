// var Chance = require('chance')
// var chance = new Chance()
var _ = require('underscore')
var pg = require('pg')

pg.defaults.ssl = (process.env.test)? false : true
pgurl = (process.env.test)?'postgres://localhost:5432/lok':process.env.DATABASE_URL

// console.log(pgurl)
//pq connection
var knex = require('knex')({
  client: 'postgresql',
  connection: pgurl,
  searchPath: 'knex,public'
});



module.exports.getExp = function(uid,callback){
  knex('attempt').count('correct as exp').where({
    correct:true,
    uid:uid
  }).catch(function(error) {
    console.log(error)
    return callback(error)
  })
  .then(function(tab){

    leveldata = [1,     15,    35,    65,    90,
                111,   150,   204,   291,   385,
                532,   691,   878,  1197,  1450,
                1965,  2332,  2743,  3200,  3704,
                 4259,  5529,  6250,  7873,  9755]
    var exp = tab[0].exp;
    for (var lvl = 0;lvl<leveldata.length;lvl++){
      if (exp <= leveldata[lvl]){
        return callback({
          string: (parseInt(lvl)+1) + " (" + exp + "/" + leveldata[lvl]+ ")",
          lvl:lvl+1,
          exp:exp
        })
      }
    }

    callback(tab[0].exp)
  })
}

module.exports.getProfile = function(uid, callback){

	knex.select().from('record').where({'uid':uid})
      .catch(function(error) {
        console.log(error)
        return callback(error)
      })
      .then(function(tab){
        // console.log(uid + "is uid")
        // console.log(tab)
        if (tab.length== 0) {
          console.log("returning null")
          return callback(null);
        }
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
        // console.log("tosend " + toSend)
        return callback(toSend)
        })

      }

  module.exports.getBasic = function(uid, callback){

  	knex.select().from('student').where({'uid':uid})
        .catch(function(error) {
          console.log(error)
          return callback(error)
        })
        .then(function(tab){
          callback(tab[0])
        })
}

module.exports.attempt = function(dataset, callback){
  // console.log(dataset)
	knex('attempt').insert(dataset)
      .catch(function(error) {
        console.log(error)
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

module.exports.checkPassed = function(query, callback){
  // console.log("q")
  // console.log(query)
  knex('record').count("uid").where({
    uid:query.uid,
    module:query.module,
    chapter:query.chapter,
    section:query.section
  }).catch(function(error) {
    console.log(error)
    return callback(error)
  })
  .then(function(d){
    // console.log("this")
    console.log(d)
    return callback(d)

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

	knex.select('student.nickname','leader.score').from('leader').innerJoin('student','student.uid','leader.uid').orderBy('score','desc').where("logicise",name)
      .catch(function(error) {
        console.log(error)
        return callback(error)
      })
      .then(function(tab){
        return callback(tab)
        })

      }
