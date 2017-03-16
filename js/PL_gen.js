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


var Model = function(parm){
  if (parm == null) this.generateUD()
  else if (parm.ud) this.ud = ud;
  else this.generateUD(parm.n,parm.type)

  this.referents = {}
  this.names = []
  this.predicates = {}
}

Model.prototype.generateUD = function(n,type){
  if (n == null) n = Math.max(1, Math.round(chance.normal({mean: 8, dev: 2})))
  var objectCategory = ["first", "country", "last","state","constant"]
  if (type == null) type = chance.pickone(objectCategory)
  this.ud = generateUD(n,type)
  this.udType = type

}


Model.prototype.generateReferents = function(distro){
  var self = this
  var ud = this.ud
  var names = []
  var referents = {}
  if (this.udType == "constant"){
    for (obj in ud){
      var c = ud[obj]
      names.push[c]
      referents[c] = c
    }
  }else{
    if (distro == "all"){
      for (obj in ud){
        var object = ud[obj]
        if (!_.contains(names,object[0].toLowerCase()) || _.contains(variables,object[0].toLowerCase())){
          var c = object[0].toLowerCase()
        } else{
          var c = chance.pickone(_.without(constants,names))
        }
        names.push(c);
        referents[c] = ud[obj];
      }
    } else if (distro == "iid"){
      var n = Math.min(Math.max(1, Math.round(chance.normal({mean: 3, dev: 2}))),ud.length)
      for (var i = 0;i<n;i++){
        var object = chance.pickone(_.without(ud,referents.values))
        if (!_.contains(names,object[0].toLowerCase()) || _.contains(variables,object[0].toLowerCase())){
          var c = object[0].toLowerCase()
        } else{
          var c = chance.pickone(_.without(constants,names))
        }
        names.push(c);
        referents[c] = ud[obj];
      }
    }
  }



  this.names = names;
  this.referents = referents;


  var types = {
    "all":function(){


    },
    "iid": function(){


    }
  }
}

module.exports.Model = Model

function allCombination(ud,n){
  if (n == 1) return ud
  set = []

  _.each(ud, function(x){
    _.each(ud,function(y){
      if (n == 2){
        set.push([x,y])
      }else{
        _.each(ud,function(z){
          set.push([x,y,z])
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
    var element = []
    for (var i = 0; i < place; i++){
      element.push(chance.pickone(ud))
    }
    if (!_.contains(extension,element)){
      extension.push(element)
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
      var element =  []
      for (i = 0;i<place;i++){
        element.push(self.ud[obj])
      }
      extension.push(element)
    }
  } else if (distribution == "all"){
    extension = allCombination(this.ud,place)

  }else if (distribution == "random"){
    extension = randomizeExtension(this.ud,place)
  }
  this.predicates[newPred] = extension
}

Model.prototype.generateAtomic

Model.prototype.interpret = function(sentence){
  var ud = this.ud;
  var predicates = this.predicates
}

var Proposition = function(left, main, right) {
  /// Check number of predicates
    if (main == negation && right != null) throw 'Negated sentence cannot have a right component.'
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



// Proposition.prototype.randomize
