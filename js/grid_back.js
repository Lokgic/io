var Chance = require('chance')
var test = require('tape')

var chance = new Chance();
var _ = require('underscore');
var vowel = ['a','e','i','o','u'];
var consonant = ['b', 'h' ,'p', 'z', 'g',"j","k"];
var letter = _.union(vowel, consonant)
var even = ["2","4","6","8"]
var odd = ['1','3','5','7']
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


var weight = [.25,.25,.25,.25]
var rows  = 3;
var cols =3
var numOfCards = rows*cols





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



var is = {
  number:function(input){
    return _.contains(allObjects.letter, input)
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
        for (col in grid[row]) {
         xcol = grid[row][col].indexOf(x)
        }
      }
      if (grid[row].indexOf(y) != -1) {
        for (col in grid[row]) {
         ycol = grid[row][col].indexOf(y)
        }
      }
    }
    return xcol < ycol
  },
  right:function(x,y,grid){

    for(row in grid){
      if (grid[row].indexOf(x) != -1) {
        for (col in grid[row]) {
         xcol = grid[row][col].indexOf(x)
        }
      }
      if (grid[row].indexOf(y) != -1) {
        for (col in grid[row]) {
         ycol = grid[row][col].indexOf(y)
        }
      }
    }
    return xcol > ycol
  }
}
var allPredicates = _.allKeys(is)



var Model = function(){
  var pool = chance.pickset(allObjects.all , numOfCards);
  var grid = []
  var index = 0;
  for (var i = 0; i < rows;i++){
    grid[i] = []
    for (var j = 0;j<cols;j++){
      grid[i][j] = pool[index]
      index += 1;
    }


  }
  this.ud = pool.sort()
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

module.exports.Model = Model;
// test
// testmode = new Model()
// console.log(test)
// console.log(allObjects.all)
// function printGrid(x){
//   console.log(x[0])
//   console.log(x[1])
//   console.log(x[2])
//
// }



//
// test('trying out a model', function(t){
//
//
//   t.plan(4)
//   model = new Model()
//   printGrid(model.grid)
//   // console.log(model)
// //   console.log(   _.every(model.ud, function(x){
// //       return _.some(model.ud, function(y){
// //         // console.log("is" +x+ "above" + y+ isAbove(x,y, model.grid))
// //         return isAbove(x,y, model.grid)})
// //     })
// // )
//
//   p ="sameRow"
//   pE = buildExtension(model.grid, model.ud,p)
//   checkp = _.every(pE, function(x){
//
//     return is[p](x[0],x[1],model.grid)
//   })
//
// console.log("something v is under something?")
// console.log(_.some(model.vowel, function(x){
//   return _.some(model.under, function(y){
//     // console.log(y[0]+ " vs "  +x)
//     return y[0] == x
//   })
// }))
//
//
//   var checkCon = _.every(model.consonants, function(x) {
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
