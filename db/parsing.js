var fs = require('fs'); 
var parse = require('csv-parse');

var csvData=[];
fs.createReadStream('./problem/concept.csv')
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