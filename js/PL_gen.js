var Chance = require('chance')
var chance = new Chance();
var d3 = require('d3')
var _ = require('underscore');
var constants = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i','j','k','l', 'm', 'n', 'o', 'p','q', 'r', 's', 't'];
var variables = ['x', 'y', 'z','u','v','w']
var predicates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
var every = '\\forall';
var some = '\\exists'
var negation = '\\neg'
var conditional = '\\to'
var conjunction = '\\wedge'
var disjunction = '\\vee'
var iff = '\\leftrightarrow'
var connectives = [conjunction, conditional, disjunction, iff, negation]

var generateUD = require('./generateUD.js')


var Model = function(ud){
  this.ud = ud;
  this.referents = {}
  this.names = []
  this.predicates = {}
}

module.exports.Model = Model

function allCombination(ud,n){
  if (n == 1) return ud
  set = []

  _.each(ud, function(x){
    _.each(ud,function(y){
      if (n == 2){
        set.push(x+y)
      }else{
        _.each(ud,function(z){
          set.push(x+y+z)
        })
      }
    })
  })


  return set.sort()
}


function randomizeExtension(ud, place, proportion){
  proportion = (proportion == null)? chance.normal({mean: 0.4, dev: 0.2}) : proportion;
  var max = Math.pow(ud.length,place)
  var probScale = d3.scaleLinear()
    .domain([0, 1])
    .range([1, max])
    .clamp(true)
  var n = chance.integer({min:0,max:probScale(proportion)})
  var extension = []
  while (extension.length < n){
    var potent = ""
    for (var i = 0; i < place; i++){
      potent += chance.pickone(ud)
    }
    if (!_.contains(extension,potent)){
      extension.push(potent)
    }
  }
  return extension.sort()
}

Model.prototype.generatePredicate = function(place, distribution){
  self = this
  var currentPredicates = _.allKeys(this.predicates)
  var extension = []
  var newPred = chance.pickone(_.without(predicates, currentPredicates))
  if (distribution == "self"){
    for (obj in self.ud){
      var str = ""
      for (i = 0;i<place;i++){
        str += self.ud[obj]
      }
      extension.push(str)
    }
  } else if (distribution == "all"){
    extension = allCombination(this.ud,place)

  }else if (distribution == "random"){
    extension = randomizeExtension(this.ud,place)
  }
  this.predicates[newPred] = extension
}

var Proposition = function(left, main, right) {
  /// Check number of predicates
    if (main == negation && right != null) throw 'Negated Sentence cannot have right connective.'
    if (left != null && right == null) {
      this.single = true
      this.double = false
      if (main != null){
        this.atomic = false
      } else{
        if (left.letter){
          this.atomic = true
        } else {
          this.atomic = false
        }
      }
    } else{
      this.double = true
      this.single = false
      this.atomic = false
    }
    this.left = left
    this.right = right
    this.main = main

  }

module.exports.Proposition = Proposition


function initModel(d) {
    diff = d;
    pLetter = randomPickset(predicates, chance.integer({
        min: 1,
        max: 4
    }));

    predicates_pickedForModel = {};
    for (p in pLetter) {
        temp = {
            letter: pLetter[p],
            place: chance.weighted([1, 2, 3], diff.predicatesDistribution),
            vars: []
        }
        predicates_pickedForModel[pLetter[p]] = temp;
    }
    numberOfObject = Math.max(1,Math.round(chance.normal(diff.objectsDistribution)))
    // console.log(numberOfObject +" =  "+numberOfObject)
    ud = generateUD(numberOfObject);
    names = chance.pickset(constants, Math.max(1,Math.round(chance.normal(diff.constantsDistribution)))).sort()
    allRefs = []
    for (name in names) {
        allRefs.push(new Constant(names[name], chance.pickone(ud)))
    }

    var model = {}
    model.referents = {}
    model.extensions = {}
    model.ud = ud
    for (r in allRefs) {
        model.referents[allRefs[r].name] = allRefs[r];
    }


    for (p in predicates_pickedForModel) {
        model.extensions[predicates_pickedForModel[p].letter] = initExtension(predicates_pickedForModel[p].letter, model, predicates_pickedForModel[p].place);
    }

    model.names = names
        // console.log(model)
        // for (ex in model.extensions){
        //   console.log(model.extensions[ex].extension)
        // }
    return model;
}


// Proposition.prototype.randomize
