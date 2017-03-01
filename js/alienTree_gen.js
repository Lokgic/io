var Chance = require('chance')
var chance = new Chance();
var _ = require('underscore');
var constants = "abcdefghijklmnopqrst".split('')
var color = ["blue","green","yellow","red","black","grey"]

var Alien = function(name, color, parent,constant){
  this.name = name;
  this.parent = parent;
  this.color = color;
  this.constant = constant;
}


function makeAliens(n){
  var namePool = []
  while (namePool.length < n){
    var temp = chance.last()
    if (!_.contains(namePool,temp)) namePool.push(temp)
  }
  var constantPool = chance.pickset(constants,n)

  var output = []
  while (namePool.length > 0){
    output.push(new Alien(namePool.pop(),chance.pickone(color),null,constantPool.pop()))
  }
  return output
}

console.log(makeAliens(5))
