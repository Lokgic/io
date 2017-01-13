var pg = require('pg')
var bcrypt = require('bcrypt')

pg.defaults.ssl = (process.env.test)? false : true
pgurl = (process.env.test)?'postgres://localhost:5432/test':process.env.DATABASE_URL

//pq connection
var knex = require('knex')({
  client: 'postgresql',
  connection: pgurl,
  searchPath: 'knex,public'
});


knex.select("password").from('students').where("username","michael").then(function(d){
  console.log(d)
  var result = bcrypt.compareSync('ccc',d[0].password)
  console.log(result)

});
