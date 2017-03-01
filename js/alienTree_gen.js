var d3 = require('d3')
var Chance = require('chance')
var chance = new Chance();
var _ = require('underscore');
var pl = require('./model_gen.js')
var constants = "abcdefghijklmnopqrst".split('')
var color = ["blue","green","pink","red","black","purple"]

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

function buildRelations(aliens){


  for (var i = 0; i<aliens.length;i++){

    var tries = 0;
    var horizon = 5
    while (tries < horizon){
      var possibility = chance.pickone(aliens)
      if (possibility != aliens[i] && !ancestorOf(aliens[i], possibility, aliens)){
        aliens[i].parent = possibility.name;
        break;
      }
      tries += 1;
      if (tries == horizon){
        aliens[i].parent = findParent(aliens[i])
      }
    }
  }
  return aliens
}

function ancestorOf(x,y,all){
  if (y.parent == null ) return false
  else if (y.parent == x.name|| x == y) return true;
  else {
    for (alien in all){
      if (all[alien].name == y.parent){
        return ancestorOf(x,all[alien],all)
      }
    }
  }
}


var predicates = {
  ancestorOf: ancestorOf(x,y,all),
  parentOf: function(x,y){return y.parent == x.name},
  childOf: function(x,y){return x.parent == y.name},
  sameLineage: function(x,y,all){return ancestorOf(x,y,all) && ancestorOf(y,x,all)},
  sameColorAs:function(x,y){return x.color == y.color},
  sameFamilyAs:function(x,y){return parentOf(x,y) || parentOf(y,z)|| siblingOf(x,y)},
  siblingOf:function(x,y){return x.parent == y.parent}
}
alienTree1 = function alienTree1(n){
  return buildRelations(makeAliens(n))
}

function findParent(x,all){
  for (y in all){
    if (!ancestorOf(x,all[y],all))
    return all[y].name
  }
  return null;
}
module.exports.alienTree1 = alienTree1

a = alienTree1(5)

console.log(buildRelations(a))
