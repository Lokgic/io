var test = require('tape')
var Proposition = require('./PL_gen.js').Proposition
var Model = require('./PL_gen.js').Model
var generateUD = require('./generateUD.js')
//
// test('evaluation', function(t) {
//   t.plan(10)
// }

A = {
    letter:"P",
    place: 2,
    vars: ["a","b"]
}

// console.log(new Proposition(A,"\\neg"))
// console.log(generateUD(5,"constant") )
var m = new Model({n:2})
m.generatePredicate(3,"random")
m.generatePredicate(2,"self")
m.generateReferents("iid")
console.log(JSON.stringify(m, null, 2));
