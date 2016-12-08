var Chance = require('chance')
var chance = new Chance();
var _ = require('underscore');

//preloading variables for stringbuilding
var constants = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't'];
var variables = ['x','y','z']
var predicates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
var forall = '\\forall';
var exists = '\\exists'
var negation = '\\neg'
var conditional = '\\to'
var conjunction = '\\wedge'
var disjunction = '\\vee'
var quantifiersOptions = [exists, forall]
var connectives = [conjunction, conditional, disjunction]
var objectCategory =["first","country","last","name","street"]
var catArg = {
  "state":{full:true,territories: false},
  "country":{full:true},
  "street":{short_suffic:true}
}
function generateUD(n){
  choice = chance.pickone(objectCategory)
  return chance.unique(chance[choice], n,catArg[choice])
}

var level ={
  "0":{
    identityProb:[0.5,0.5],
    negatedAtomic: 5,
    negatedComplex: 10,
    predicatesDistribution:[.6,.4,0], //how many place
    constantsDistribution: {mean:4, dev:1},
    objectsDistribution: {mean:3, dev:0.5},
    extensionOptions:["all", "self", "mixed", "none"],
    extensionDistribution:[0.1,0.2,0.35,0.35], //4
    predicatesVariableConstantRatio:[.5,.5]
  }
}

var id ={
  letter:"id",
  place:2
}

var diff = 0;
//////MODEL RELATED STUFF
function randomPickset(arr, max, min) {

    if (max > arr.length) {
        max = arr.length;
    }
    if (min > max) {
        max = min
    }
    if (typeof max == 'undefined' && typeof min == 'undefined') {
        max = arr.length;
        min = 0;
    } else if (typeof min == 'undefined' && typeof max != 'undefined') {
        min = max
    }

    return chance.pickset(arr, chance.integer({
        min: min,
        max: max
    }))
}

function initModel(){
  pLetter = randomPickset(predicates, chance.integer({
      min: 1,
      max: 4
  }));

  predicates_pickedForModel = {};
  for (p in pLetter) {
    temp = {
      letter: pLetter[p],
      place: chance.weighted([1, 2, 3], level[diff].predicatesDistribution),
      vars:[]
    }
    predicates_pickedForModel[pLetter[p]] = temp;
  }
  numberOfObject = Math.round(chance.normal(level[diff].objectsDistribution))
  ud = generateUD(numberOfObject);
  names = chance.pickset(constants, Math.round(chance.normal(level[diff].constantsDistribution))).sort()
  allRefs = []
  for (name in names){
    allRefs.push(new Constant(names[name], chance.pickone(ud)))
  }

  var model = {}
  model.referents = {}
  model.extensions = {}
  model.ud = ud
  for (r in allRefs){
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


function initExtension(p, model, place) {
    ud = model.ud
    refs = model.referent
    out = {
        "letter": p,
        "place": place
    }
    ex = [];
    string = "";
    if (out.place == 1) {
        ex = randomPickset(ud, chance.weighted([0, ud.length], [5, 95]), 0).sort()
        string = '<p>' + p + ' : { ' + ex.join(' , ') + ' }</p>'

    } else {

        option = chance.weighted(level[diff].extensionOptions, level[diff].extensionDistribution);

        if (option == "none") {


        } else if (option == "self") {
            n = chance.integer({
                min: 1,
                max: ud.length
            });
            for (x in ud) {
                temp = []
                for (var i = 0; i < out.place; i++) {
                    temp.push(ud[x]);
                }
                ex.push(temp)
            }

        } else if (option == "all") {
            for (x in ud) {
                for (y in ud) {
                    temp = [ud[x], ud[y]]
                    // console.log(temp)

                    if (out.place == 3) {

                        for (z in ud) {
                            temp.push(ud[z])
                            ex.push(temp)
                        }
                    } else ex.push(temp)

                }
            }
        } else {

            n = chance.integer({
                min: 1,
                max: chance.integer({
                    min: 2,
                    max: 10
                })
            });
            if (n > (ud.length * ud.length)) n = ud.length * ud.length
            for (var i = 0; i < n; i++) {
                var pair = [];

                for (var j = 0; j < out.place; j++) {
                    pair.push(chance.pickone(ud))
                }


                while (_.contains(ex, pair)) {
                    var pair = [];
                    for (var j = 0; j < out.place; j++) {
                        pair.push(chance.pickone(ud))
                    }

                }

                ex.push(pair);


            }

            ex = ex.sort()


        }

        if (option == 'none') {
            string += "<p>" + p + ": { } " + "</p>"
        } else {
            // tempString = ex[0].split('').join(' , ')
            var string = "<p>" + p + " : { ( " + ex[0] + " ) ";

            for (var i = 1; i < ex.length; i++) {
                // tempString = ex[i].split('').join(' , ')
                string += ", ( " + ex[i] + " ) ";
            }
            string += ' }</p>'
        }


    }
    // console.log(ex)
    out.string = string;
    out.extension = ex;
    return out;
}



var Constant = function(name, obj){
  this.name = name;
  this.referent = obj
}


/////////


////PROPOSITION RELATED

var Proposition = function(model){

  var o = {
    variables: variables,
    constants : model.names
  }

  left =   chance.weighted([model.extensions[chance.pickone(Object.keys(model.extensions))], id], level[diff].identityProb);
  right =   chance.weighted([model.extensions[chance.pickone(Object.keys(model.extensions))], id], level[diff].identityProb);

  this.left = {
    letter: left.letter,
    place: left.place,
    negated: chance.bool({likelihood:level[diff].negatedAtomic})
  }
  this.right = {
    letter: right.letter,
    place: right.place,
    negated: chance.bool({likelihood:level[diff].negatedAtomic})
  }

  if (this.left.negated) this.left.prefix = negation
    else this.left.prefix = ""
  if (this.right.negated ) this.right.prefix = negation
    else this.right.prefix = ""
  this.negated = chance.bool({likelihood:level[diff].negatedComplex})
  if (this.negated) this.prefix = negation
    else this.prefix = ""
  this.totalPlace = this.left.place + this.right.place;

  this.left.vars = ""
  this.right.vars = ""
  var quantifiersStr = "";


      for (var i = 0;i < this.left.place;i++){
        //
        // this.left.vars += chance.pickone(o[chance.integer({min:0, max: o.length - 1})])

        // console.log(o["constants"])
      this.left.vars += chance.pickone(o[chance.weighted(["variables", "constants"],level[diff].predicatesVariableConstantRatio)])


    }
    for (var i = 0;i < this.right.place;i++){
        this.right.vars += chance.pickone(o[chance.weighted(["variables", "constants"],level[diff].predicatesVariableConstantRatio)])

    }


    var allVars = _.uniq((this.left.vars + this.right.vars).split('')) // combine left and right's variable-string, turn it into an array, then use _ to get rid of dups. this will become quanitifer order
    allVars = _.shuffle(_.filter(allVars, function(x){
      return _.contains(variables, x)
    }))

    this.allVars = allVars;
    this.quantifiers = {}

    for (v in allVars){

      this.quantifiers[allVars[v]] = {
        variable: allVars[v],
        quantifier: chance.pickone(quantifiersOptions)
      }

      this.prefix += this.quantifiers[allVars[v]].quantifier + " "+ allVars[v]
    }



    this.connective = chance.pickone(connectives)
    if (this.left.letter == "id") var leftStr = this.left.prefix+" " +this.left.vars[0] + "=" + this.left.vars[1];
    else var leftStr = this.left.prefix+" " + this.left.letter + this.left.vars;
    if (this.right.letter == "id") var rightStr = this.right.prefix+" " +this.right.vars[0] + "=" + this.right.vars[1];
     else var rightStr = this.right.prefix +" "+  this.right.letter + this.right.vars;
    this.string = this.prefix  + " ( "+leftStr + " "+ this.connective +" "+ rightStr+ " ) "






  }



var check = {
  isIdentical: function(x,y){
    return  x.referent == y.referent
  },
  isConstant: function(x){
    return _.contains(constants, x);
  },
  isVariable: function(x){
    return _.contains(variables, x);
  },
  hasConstant: function(x){
    for (y in x.split('')){
      if (this.isConstant(y)) return true;
    }
    return false;
  },
  hasVariable: function(x){
    for (y in x.split('')){
      if (this.isVariables(y)) return true;
    }
    return false;
  },
  onlyConstant: function(x){
    return _.every(x.split(''), function(y){
      return _.contains(constants, y);
    });
  },
  onlyVariable: function(x){
    return _.every(x.split(''), function(y){
      return _.contains(variables, y);
    });
  }
}



test = initModel()
p = new Proposition(test)
console.log(test)
console.log(p)
