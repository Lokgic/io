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
