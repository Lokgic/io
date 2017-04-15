var Chance = require('chance')


var chance = new Chance();
var _ = require('underscore');
var vowel = ['a','e','i','o','u'];
var consonant = ['b', 'h' ,'p', 'z', 'g',"j","k"];
var letter = _.union(vowel, consonant)
var even = ["2","4","6","8"]
var odd = ['3','5','7','9']
var number = _.union(even, odd)
var all = _.union(letter, number)
var allObjects = {
  letter:letter,
  number:number,
  vowel: vowel,
  consonant:consonant,
  even:even,
  odd: odd,
  all: all
}
var kind = {
  number: ["even", "odd"],
  letter: ["vowel", "consonant"]
}

var relation = {
  x: ["left", "right", "sameRow"],
  y: ["above", "under", "sameCol"]
}

var quantifiers = ["every", "some"]
var wp = [0.4,.4,.2]
var prefix = ["atMost","atLeast","exactly"]
var rows  = 3;
var cols =3
var numOfCards = rows*cols

//number of objects
var wo = [0.4, 0.4,0.2]


var CardObj = function(face, color){


	this.face = face;


	if (color == undefined){
		if (chance.bool()){
			this.color = "danger"
		} else{
			this.color ="info"
	}}else {
		this.color = color;
	}

	this.type = checkType(face)
  this.cardOrLetter = numberOrLetter(face)

}

var checkQuantity = function(how, set,q){
  // console.log(set)
  if (how == "atLeast") return set.length >= q;
  else if (how == "atMost") return set.length <= q;
  else if (how == "exactly") return set.length == q
}

var Statement = function(){
  var options = chance.shuffle(_.union(kind.number, kind.letter));
  this.prefix = chance.weighted(prefix, wp)
  this.quantifier_1 = chance.weighted([1,2,3],wo)
  this.kind_1= options.pop();
  this.relation = chance.pickone(relation[chance.pickone(["x","y"])]);
  this.quantifier_2 = chance.pickone(quantifiers)
  this.kind_2=options.pop();
}


var is = {
  number:function(input){
    return _.contains(allObjects.number, input)
  },
  letter:function(input){
    return _.contains(allObjects.letter, input)
  },
  consonant: function(input){
    return _.contains(allObjects.consonant, input)
  },
  vowel: function(input){
    return _.contains(allObjects.vowel, input)
  },
  even: function (input){
    return _.contains(allObjects.even, input)
  },
  odd: function(input){
    return _.contains(allObjects.odd, input)
  },
  above: function(x,y,grid){
    for(row in grid){
      if (grid[row].indexOf(x) != -1) xrow = row
      if (grid[row].indexOf(y) != -1) yrow = row
    }
    return xrow < yrow
  },
  under: function(x,y,grid){
    for(row in grid){
      if (grid[row].indexOf(x) != -1) xrow = row
      if (grid[row].indexOf(y) != -1) yrow = row
    }
    return xrow > yrow
  },
  sameRow: function(x,y,grid){
    if (x == y) return false;
    for(row in grid){
      if (grid[row].indexOf(x) != -1) xrow = row
      if (grid[row].indexOf(y) != -1) yrow = row
    }
    return xrow == yrow
  },
  sameCol: function(x,y,grid){
    if (x == y) return false;
    for(row in grid){
      if (grid[row].indexOf(x) != -1) {

         xcol = grid[row].indexOf(x)

      }
      if (grid[row].indexOf(y) != -1) {

         ycol = grid[row].indexOf(y)

      }
    }
    return xcol == ycol
  },
  left:function(x,y,grid){

    for(row in grid){
      if (grid[row].indexOf(x) != -1) {

         xcol = grid[row].indexOf(x)

      }
      if (grid[row].indexOf(y) != -1) {
         ycol = grid[row].indexOf(y)
      }
    }
    return xcol < ycol
  },
  right:function(x,y,grid){

    for(row in grid){
      if (grid[row].indexOf(x) != -1) {

         xcol = grid[row].indexOf(x)

      }
      if (grid[row].indexOf(y) != -1) {
         ycol = grid[row].indexOf(y)
      }
    }
    return xcol >ycol
  }
}
var allPredicates = _.allKeys(is)



var Model = function(grid,ud){

  if (ud == undefined) {
    if (grid!= undefined) ud = _.flatten(grid)
    else ud = chance.pickset(allObjects.all , numOfCards);
  } else ud = chance.shuffle(ud)


  if (grid == undefined){

    var grid = []
    var index = 0;
    for (var i = 0; i < rows;i++){
      grid[i] = []
      for (var j = 0;j<cols;j++){
        grid[i][j] = ud[index]
        index += 1;
      }
    }
  }

  this.ud = ud.sort()
  this.grid = grid;
  for (pLetter in allPredicates){
    this[allPredicates[pLetter]] = buildExtension(this.grid, this.ud, allPredicates[pLetter])
  }


}

function buildExtension(grid, ud, predicate){
  if (is[predicate].length == 1) {
    return _.filter(ud, function(x){
      return is[predicate](x)
    })
  }else {
    extension = []
    _.each(ud, function(x){
      _.each(ud, function(y){
        if (is[predicate](x, y, grid)) extension.push([x,y])
      })
    })
    return extension
  }

}



function printGrid(x){
  console.log(x[0])
  console.log(x[1])
  console.log(x[2])

}

function generateStatements(n,model){
  problemSet = []
  for (var i = 0;i<n;i++){
    prob = []
    stat = new Statement()
    prob.push(stat)
    if (model!=undefined) prob.push(evaluate(prob[0],model))
    problemSet.push(prob)
  }
  return problemSet;
}


function evaluate(stat, model){


  filteredSet = _.filter(model[stat.kind_1], function(x){
    return _[stat.quantifier_2](model[stat.kind_2], function(y){return is[stat.relation](x, y, model.grid)})

  })



  return checkQuantity(stat.prefix, filteredSet, stat.quantifier_1)


}


ud = ['b', 'h', 'a','e','i','1','3','5','7']
grid = [
          ['b','h','k'],
          ['3','e','5'],
          ['6','j','1']
]
// model = new Model(grid)
// console.log(generateStatements(12,model))
// printGrid(model.grid)

stat = {

  prefix : "atMost",
  quantifier_1 : 1,
  kind_1: "vowel",
    relation :"above",
  quantifier_2 :"some",
  kind_2: "consonant"
}
// console.log(stat)
// console.log(evaluate(stat, model))
var debug = false

if (debug){
  var test = require('tape')
test('evaluation', function(t){


  t.plan(11)
  ud = ['b', 'h', 'a','e','i','2','4','5','7']
  grid = [
            ['t','a','7'],
            ['4','e','5'],
            ['6','i','9']
  ]
  model = new Model(grid)
  // console.log(generateStatements(12,model))
  printGrid(model.grid)



        stat = {

          prefix : "atLeast",
          quantifier_1 : 1,
          kind_1: "vowel",
            relation :"under",
          quantifier_2 :"some",
          kind_2: "even"
        }


        t.assert(evaluate(stat, model))

      stat = {

        prefix : "atMost",
        quantifier_1 : 10,
        kind_1: "number",
          relation :"under",
        quantifier_2 :"some",
        kind_2: "even"
      }


      t.assert(evaluate(stat, model))

    stat = {

      prefix : "exactly",
      quantifier_1 : 4,
      kind_1: "number",
        relation :"under",
      quantifier_2 :"some",
      kind_2: "even"
    }


    t.assert(evaluate(stat, model))


  stat = {

    prefix : "atLeast",
    quantifier_1 : 1,
    kind_1: "even",
      relation :"left",
    quantifier_2 :"every",
    kind_2: "vowel"
  }


  t.assert(evaluate(stat, model))



    stat2 = {

      prefix : "atLeast",
      quantifier_1 : 1,
      kind_1: "vowel",
        relation :"right",
      quantifier_2 :"every",
      kind_2: "even"
    }

    t.assert(evaluate(stat2, model))

        stat2 = {

          prefix : "exactly",
          quantifier_1 : 3,
          kind_1: "vowel",
            relation :"right",
          quantifier_2 :"every",
          kind_2: "even"
        }

        t.assert(evaluate(stat2, model))

        stat2 = {

          prefix : "exactly",
          quantifier_1 : 2,
          kind_1: "vowel",
            relation :"above",
          quantifier_2 :"some",
          kind_2: "even"
        }

        t.assert(evaluate(stat2, model))
        stat2 = {

          prefix : "atMost",
          quantifier_1 : 3,
          kind_1: "vowel",
            relation :"above",
          quantifier_2 :"some",
          kind_2: "even"
        }

        t.assert(evaluate(stat2, model))
        stat2 = {

          prefix : "exactly",
          quantifier_1 : 3,
          kind_1: "number",
            relation :"left",
          quantifier_2 :"every",
          kind_2: "vowel"
        }

        t.assert(evaluate(stat2, model))

        stat2 = {

          prefix : "exactly",
          quantifier_1 : 3,
          kind_1: "number",
            relation :"right",
          quantifier_2 :"every",
          kind_2: "letter"
        }

        t.assert(evaluate(stat2, model))

        stat2 = {

          prefix : "atLeast",
          quantifier_1 : 4,
          kind_1: "number",
            relation :"above",
          quantifier_2 :"some",
          kind_2: "letter"
        }

        t.assert(evaluate(stat2, model))
})}
// }//
//
//
// test('trying out a model', function(t){
//
//
//   t.plan(4)
//   model = new Model()
//   printGrid(model.grid)
  // var stat = new Statement()
  // console.log(stat)
  //
  // test = _.filter(model[stat.kind_1], function(x){
  //   return _[stat.quantifier_2](model[stat.kind_2], function(y){return is[stat.relation](x, y, model.grid)})
  //
  // })
  //
//   // console.log(stat.quantifier_1+" " + stat.kind_1 + "   is  " + stat.relation + " " + stat.quantifier_2 + "  " + stat.kind_2 + " "+ test)
//
//   var checkCon = _.every(model.consonant, function(x) {
//     return is.consonant(x)
//   })
//
//
//   t.equal(checkCon, true, "checking consonant predicates")
//
//     t.equal(_.every(model.vowels, function(x) {
//       return is.vowel(x)
//     }), true, "checking vowel predicates")
//
//     t.equal(_.every(model.even, function(x) {
//       return is.even(x)
//     }), true, "checking even predicates")
//
//
//
//
//
//   actual = _.every(model.grid, function(r){
//     for (x in r){
//       if (_.isUndefined(r[x]))return false
//     }
//     return true
//   })
//   t.equal(actual, true, "grid defined")
// })
module.exports.Model = Model;
module.exports.generateStatements = generateStatements
