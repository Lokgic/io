var fs = require('fs');
var parse = require('csv-parse');

var csvData=[];
fs.createReadStream('db/problem/concept.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        // console.log(csvrow);
        //do something with csvrow
        csvData.push(csvrow);
    })
    .on('end',function() {
      //do something wiht csvData
      csvData.splice(0,1)
      console.log(csvData);
    });



exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('problem').del()
    .then(function () {
      var problemPromises = [];
      csvData.forEach(function(problem){
    problemPromises.push(createUser(knex, problem));
   });
      return Promise.all(problemPromises);
    });
};



function createUser(knex, problem) {
  return knex.table('problem')
    .insert(
    { pid:problem[0],
      type: problem[1],
      question: problem[2],
      answer: problem[3],
      options: problem[4],
      module:problem[5],
      chapter: problem[6],
      section: problem[7]
    }
  )

}
