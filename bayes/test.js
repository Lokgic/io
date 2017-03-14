


// module.exports.test = function(){
//
// }

var PythonShell = require('python-shell');

var options = {
  mode: 'text',
  args: [[1,2,3,4]]
};

PythonShell.run('script.py', options, function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('results: %j', results);
});
