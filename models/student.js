var pg = require('pg')
var bcrypt = require('bcrypt')

pg.defaults.ssl = (process.env.test)? false : true
pgurl = (process.env.test)?'postgres://localhost:5432/lok':process.env.DATABASE_URL
// console.log(process.env.test)
//pq connection
var knex = require('knex')({
  client: 'postgresql',
  connection: pgurl,
  searchPath: 'knex,public'
});


// //check pw
// knex.select().from('students').where("sid","m1").then(function(d){
// 	if (d.length == 0){
// 		console.log("no such user found")
// 	}
// 	else if (d.length == 1) var result = bcrypt.compareSync('abc',d[0].password)

//   	if (result){
//   		console.log(d[0])
//   	}else{
//   		console.log('wrong username or password')
//   	}
//   console.log(result)

// });




module.exports.authenticate = function(username, password, callback){

	knex.select().from('student').where("email",username).then(function(d){
	if (d.length == 0){
		console.log("no such user found")
		var err = new Error('No such user!');
        err.status = 401;
        return callback(err);
	}
	else if (d.length == 1) var result = bcrypt.compareSync(password,d[0].password)

  	if (result === true){
  		return callback(null, d[0]);
  		// console.log(d[0])
  	}else{
  		console.log('wrong username or password')
  		return callback();

  	}
  });
}


      // Inserts seed entries




module.exports.create = function(u, callback){
  // console.log(u)
  knex('student').insert({
        nickname: u.nickname,
        email: u.email,
        name: u.name,
        password:bcrypt.hashSync(u.password, 10)
      })
      .catch(function(error) {
        return callback(error)
      })
      .then(function(){
        knex.select().from('student').where("email",u.email).then(function(d){
          // console.log(d)
          return callback(null,d[0])
        })

      })
    }
