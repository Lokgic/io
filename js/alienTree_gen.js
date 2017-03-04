var d3 = require('d3')
var Chance = require('chance')
var chance = new Chance();
var _ = require('underscore');
var pl = require('./model_gen.js')
// var constants = "abcdefghijklmnopqrst".split('')
var color = ["blue","purple","red"]


var constants = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i','j','k','l', 'm', 'n', 'o', 'p','q', 'r', 's', 't'];
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

function ancestorOf(x,y,all){
  if (y.parent == null || x == y) return false
  else if (y.parent == x.name) return true;
  else {
    for (alien in all){
      if (all[alien].name == y.parent){
        return ancestorOf(x,all[alien],all)
      }
    }
  }
}

var predicates = {
  ancestorOf: ancestorOf,
  parentOf: function(x,y,all){return y.parent == x.name},
  childOf: function(x,y,all){return x.parent == y.name},
  sameLineage: function(x,y,all){

    if (x == y) return true
    var currentNode = x;
    while (currentNode.parent != null){
      if (currentNode.parent == y.name) return true
      else {
        // console.log(all)
        currentNode = _.findWhere(all, {name: currentNode.parent});
      }
    }

    var currentNode = y;
    while (currentNode.parent != null){
      if (currentNode.parent == x.name) return true
      else {

        currentNode = _.findWhere(all, {name: currentNode.parent});
        // console.log(currentNode)
      }

      return false;
    }

  },
  sameRaceAs:function(x,y,all){return x.color == y.color},
  sameFamilyAs:function(x,y,all){return x == y || predicates.parentOf(x,y,all) || predicates.parentOf(y,x)|| predicates.siblingOf(x,y,all)},
  grandparentOf:function(x,y,all){
    if (y.parent == null) return false
    // console.log(_.findWhere(all, {name: y.parent}))
    var yParent = _.findWhere(all, {name: y.parent})
    if (yParent.parent == x.name) return true
    else return false
  },
  siblingOf:function(x,y,all){return x.parent == y.parent && x != y},
  isBlue:function(x){return x.color == "blue"},
  isRed:function(x){return x.color == "red"},
  isPurple:function(x){return x.color == "purple"},
  isBetween:function(x,y,z,all){
    if (x == y || x == z || y==z) return false
    else if ((predicates.ancestorOf(x,y,all) && predicates.ancestorOf(z,x,all)) || (predicates.ancestorOf(x,z,all) && predicates.ancestorOf(y,x,all))) return true
    else return false;
  }
}


var predicateLetter = [{
  "A":"ancestorOf",
  "P":"parentOf",
  "C":"childOf",
  "R":"sameRaceAs",
  "S":"siblingOf",
  "B":"isBlue",
  "D":"isRed",
  "U":"isPurple"
},
{
  "A":"ancestorOf",
  "P":"parentOf",
  "C":"childOf",
  "L":"sameLineage",
  "R":"sameRaceAs",
  "G":"grandparentOf",
  "S":"siblingOf",
  "B":"isBlue",
  "D":"isRed",
  "U":"isPurple",
  "F":"sameFamilyAs",
  "W":"isBetween"
}]

var predicatePlace = {
  "W":3,
  "A":2,
  "P":2,
  "C":2,
  "L":2,
  "R":2,
  "S":2,
  "B":1,
  "D":1,
  "U":1,
  "F":2,
  "G":2
}


var Alien = function(name, color, parent,constant){
  this.name = name;
  this.parent = parent;
  this.color = color;
  this.constant = constant;
}


function makeAliens(n){
  if (n > constants.length){
    n = 20
  }
  var namePool = []
  while (namePool.length < n){
    var temp = chance.last()
    if (!_.contains(namePool,temp)) namePool.push(temp)
  }
  var constantPool = []

   constantPool = chance.pickset(constants,n)

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





function findParent(x,all){
  for (y in all){
    if (!ancestorOf(x,all[y],all))
    return all[y].name
  }
  return null;
}

function makeModel(relations,letterGroup){

  var nLetter = 4
  var referents = {}
  var names = []
  var ud = []
  for (alien in relations){
    ud.push(relations[alien].name)
    names.push(relations[alien].constant)
    var r = {
      name:relations[alien].constant,
      referent:relations[alien].name
    }
    referents[relations[alien].constant] = r
  }

  var letters = chance.pickset(_.keys(predicateLetter[letterGroup]),nLetter)

  var extensions = {}
  for (l in letters){
    var obj = {}
    obj.letter = letters[l];
    obj.place = predicatePlace[obj.letter];
    obj.extension = []
    if (obj.place == 1){
      _.each(relations,function(alien){
        if (predicates[predicateLetter[letterGroup][obj.letter]](alien)){
          obj.extension.push(alien.name)
        }
      })
    } else if (obj.place == 2){
      _.each(relations,function(x){
        _.each(relations,function(y){
          if (predicates[predicateLetter[letterGroup][obj.letter]](x,y,relations)){
            obj.extension.push([x.name,y.name])
          }
        })
      })
    }else if (obj.place == 3){
     _.each(relations,function(x){
       _.each(relations,function(y){
         _.each(relations,function(z){
           if (predicates[predicateLetter[letterGroup][obj.letter]](x,y,z,relations)){
             obj.extension.push([x.name,y.name,z.name])
           }
         })

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

// function expScale(a,b,c,exp){
//   var out = d3.scaleLinear()
//     .domain([0, c])
//     .range([a, b])
//     .clamp(true)
//   return out(exp);
// }
var expScale = require('./generatorHelp.js').expScale

// console.log(expScale(1,4,20,10))
alienTree1 = function alienTree1(tier){
  if (tier == null) tier = 10
  tier = parseInt(tier)
  var probScale = d3.scaleLinear()
    .domain([0, 20])
    .range([0, 1])
    .clamp(true)
  var percentScale = d3.scaleLinear()
    .domain([0, 20])
    .range([0, 100])
    .clamp(true)

  var n = Math.round(chance.normal({mean: tier*.6, dev: expScale(1,4,20,tier)} ))
  // console.log(expScale(1,4,20,tier))
  n = Math.max(3, n)

  var relation = buildRelations(makeAliens(n))
  // console.log(relation)
  var model =  makeModel(relation,0)
  // console.log(model)
  var twoPlaceChance = expScale(0,.6,20,tier)
  var varChance = expScale(0,.3,20,tier)
  var diff =  {
      identityProb: [1,0],
      negatedAtomic:  expScale(0,15,20,tier),
      // negatedComplex: expScale(0,.3,20,tier),
      predicatesDistribution: [1-twoPlaceChance, twoPlaceChance, 0], //how many place
      predicatesVariableConstantRatio: [varChance, 1 - varChance ],
      quantifiersOptions: [chance.pickone([every,some])]
      }
      // console.log(diff)
      // var model = initModel(diff)
      // console.log(JSON.stringify(model.extensions, null, 4));
      // console.log(model)
      var output = {
        problems: pl.makeProblemSet(model,Math.round(expScale(5,1,15,tier)),diff),
        relation:relation,
        model:model
      }
  // console.log(JSON.stringify(output, null, 4));
      return output

}

alienTree2 = function alienTree2(tier){
  if (tier == null) tier = 10
  tier = parseInt(tier)
  var probScale = d3.scaleLinear()
    .domain([0, 20])
    .range([0, 1])
    .clamp(true)
  var percentScale = d3.scaleLinear()
    .domain([0, 20])
    .range([0, 100])
    .clamp(true)
  var sd = expScale(1,4,20,tier)
  var n = Math.round(chance.normal({mean: tier, dev: sd} ))

  n = Math.max(3, n)

  var relation = buildRelations(makeAliens(n))
  // console.log(relation)
  var model =  makeModel(relation,1)
  // console.log(model)
  var twoPlaceChance = expScale(0.4,.9,20,tier)
  var varChance = expScale(0.8,1,20,tier)
  var diff =  {
      identityProb: [1,0],
      negatedAtomic:  expScale(10,40,20,tier),
      // negatedComplex: expScale(0,.3,20,tier),
      // predicatesDistribution: [0, 0, 1], //how many place
      predicatesVariableConstantRatio: [varChance, 1 - varChance ],
      quantifiersOptions: [every,some]
      }
      // console.log(diff)
      // var model = initModel(diff)
      // console.log(JSON.stringify(model.extensions, null, 4));
      // console.log(model)
      var output = {
        problems: pl.makeProblemSet(model,Math.round(expScale(4,1,15,tier)),diff),
        relation:relation,
        model:model
      }
  // console.log(JSON.stringify(output, null, 4));
      return output

}




module.exports.alienTree1 = alienTree1
module.exports.alienTree2 = alienTree2
// var test =[ { name: 'Schneider', parent: 'Douglas', color: 'red', constant: 'l' },
//   { name: 'Saunders', parent: 'Schneider', color: 'black', constant: 'h' },
//   { name: 'Vega', parent: 'Lloyd', color: 'purple', constant: 'p' },
//   { name: 'Douglas', parent: 'Lloyd', color: 'black', constant: 'g' },
//   { name: 'Lloyd', parent: null, color: 'black', constant: 't' } ]

// console.log(predicates.isGreen(test))
//
// console.log(predicates.siblingOf(test[0],test[2],test))
// a = alienTree2(5)
// console.log(JSON.stringify(a, null, 4));
// console.log(a)
