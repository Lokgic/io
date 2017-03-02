var d3 = require('d3')
var Chance = require('chance')
var chance = new Chance();
var _ = require('underscore');
var pl = require('./model_gen.js')
// var constants = "abcdefghijklmnopqrst".split('')
var color = ["blue","green","red","black","purple"]


var constants = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i','j','k','l', 'm', 'n', 'o', 'p', 'r', 's', 't'];
var variables = ['x', 'y', 'z']
// var predicates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
var every = '\\forall';
var some = '\\exists'
var negation = '\\neg'
var conditional = '\\to'
var conjunction = '\\wedge'
var disjunction = '\\vee'
var iff = '\\leftrightarrow'
var quantifiersOptions = [some, every]
var connectives = [conjunction, conditional, disjunction, iff]



var predicates = {
  ancestorOf: ancestorOf,
  parentOf: function(x,y){return y.parent == x.name},
  childOf: function(x,y){return x.parent == y.name},
  sameLineage: function(x,y,all){return ancestorOf(x,y,all) && ancestorOf(y,x,all)},
  sameRaceAs:function(x,y){return x.color == y.color},
  sameFamilyAs:function(x,y){return predicates.parentOf(x,y) || predicates.parentOf(y,x)|| predicates.siblingOf(x,y)},
  siblingOf:function(x,y){return x.parent == y.parent},
  isBlue:function(x){return x.color == "blue"},
  isGreen:function(x){return x.color == "green"},
  isRed:function(x){return x.color == "red"},
  isPurple:function(x){return x.color == "purple"},
  isBlack:function(x){return x.color == "black"},
  isParent:function(x,all){
    for (alien in all){
      if (alien[all].parent == x.name) return true
    }
    return false;
  }
}


var predicateLetter = {
  "A":"ancestorOf",
  "P":"parentOf",
  "C":"childOf",
  "L":"sameLineage",
  "R":"sameRaceAs",
  "S":"siblingOf",
  "B":"isBlue",
  "D":"isRed",
  "K":"isBlack",
  "G":"isGreen",
  "U":"isPurple",
  "F":"sameFamilyAs"
}

var predicatePlace = {
  "A":2,
  "P":2,
  "C":2,
  "L":2,
  "R":2,
  "S":2,
  "B":1,
  "D":1,
  "K":1,
  "G":1,
  "U":1,
  "F":2
}


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
  var constantPool = []
  if (n > constants.length){
    var needed = n - constants.length
    for (var i = 0; i<needed;i++){
      constantPool.push("a_"+i)
    }
    constantPool = _.union(constants,constantPool)
  } else constantPool = chance.pickset(constants,n)


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



function findParent(x,all){
  for (y in all){
    if (!ancestorOf(x,all[y],all))
    return all[y].name
  }
  return null;
}

function makeModel(relations){
  var nLetter = 3
  var referents = {}
  var names = []
  var ud = []
  for (alien in relations){
    ud.push(relations[alien].name)
    names.push(relations[alien].constant)
    referents[relations[alien].constant] = relations[alien].name
  }

  var letters = chance.pickset(_.keys(predicateLetter),nLetter)
  var extensions = {}
  for (l in letters){
    var obj = {}
    obj.letter = letters[l];
    obj.place = predicatePlace[obj.letter];
    obj.extension = []
    if (obj.place == 1){
      _.each(relations,function(alien){
        if (predicates[predicateLetter[obj.letter]](alien)){
          obj.extension.push(alien.name)
        }
      })
    } else if (obj.place == 2){
      _.each(relations,function(x){
        _.each(relations,function(y){
          if (predicates[predicateLetter[obj.letter]](x,y)){
            obj.extension.push([x.name,y.name])
          }
        })
      })
    }
    extensions[letters[l]] = obj

  }


  return {
    referents:referents,
    ud:ud,
    names:names,
    extensions:extensions
  }
}

alienTree1 = function alienTree1(n,tier){
  var relation = buildRelations(makeAliens(n))
  // console.log(relation)
  var model =  makeModel(relation)
  if (tier == null) tier = 10
  var diff =  {
      identityProb: [1,0],
      negatedAtomic: 0.03*tier,
      negatedComplex: 0.01*tier,
      predicatesDistribution: [.7, .3, 0], //how many place
      constantsDistribution: {
          mean: Math.max(1,Math.floor(tier/5)),
          dev: Math.floor(tier/3)
      },
      objectsDistribution: {
        mean: Math.max(1,Math.floor(tier/5)),
        dev: 1+ Math.floor(tier/5)
      },
      extensionOptions: ["all", "self", "mixed", "none"],
      extensionDistribution: [.05, 0.2, 0.65, .1], //4
      predicatesVariableConstantRatio: [tier/130, 1 - tier/130 ],
      quantifiersOptions: [chance.pickone([every,some])]
      }
      // console.log(diff)
      // var model = initModel(diff)
      // console.log(model)
      return {
        problems: pl.makeProblemSet(model,5,diff),
        relation:relation
      }

}




module.exports.alienTree1 = alienTree1
var test = {
  "name":"kk",
  "color":"black"
}

// console.log(predicates.isGreen(test))
//
// a = alienTree1(5)
// console.log(JSON.stringify(a, null, 4));
// console.log(a)
