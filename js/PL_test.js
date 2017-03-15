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
var m = new Model(generateUD(3,"constant"))
m.generatePredicate(3,"random")
m.generatePredicate(2,"self")
console.log(m)
