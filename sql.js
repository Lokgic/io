var mysql  = require('mysql')
  , async = require('async')



var state = {
  pool: null,
  mode: null,
}

exports.connect = function(cred, callback) {
  state.pool = mysql.createPool(cred);


  callback()
}

exports.get = function() {
  return state.pool
}


exports.fixtures = function(data) {
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  var names = Object.keys(data.tables)
  async.each(names, function(name, cb) {
    async.each(data.tables[name], function(row, cb) {
      var keys = Object.keys(row)
        , values = keys.map(function(key) { return "'" + row[key] + "'" })

      pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
    }, cb)
  }, done)
}
