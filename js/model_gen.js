var Chance = require('chance')
var chance = new Chance();
var _ = require('underscore');

//preloading variables for stringbuilding
var constants = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i','j','k','l', 'm', 'n', 'o', 'p','q', 'r', 's', 't'];
var variables = ['x', 'y', 'z']
var predicates = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
var every = '\\forall';
var some = '\\exists'
var negation = '\\neg'
var conditional = '\\to'
var conjunction = '\\wedge'
var disjunction = '\\vee'
var iff = '\\leftrightarrow'
var quantifiersOptions = [some, every]
var connectives = [conjunction, conditional, disjunction, iff]
var objectCategory = ["first", "country", "last","state"]
var catArg = {
    "state": {
        full: true,
        territories: false
    },
    "country": {
        full: true
    },
    "street": {
        short_suffic: true
    }
}

function generateUD(n) {
    choice = chance.pickone(objectCategory)
    return chance.unique(chance[choice], n, catArg[choice])
}

var level = {
    "0": {
        identityProb: [0.2, 0.8],
        negatedAtomic: 0,
        negatedComplex: 0,
        predicatesDistribution: [.5, .5, 0], //how many place
        constantsDistribution: {
            mean: 7,
            dev: 1
        },
        objectsDistribution: {
            mean: 3,
            dev: 0.5
        },
        extensionOptions: ["all", "self", "mixed", "none"],
        extensionDistribution: [.2, 0.2, .5, .1], //4
        predicatesVariableConstantRatio: [0, 1]
    },
    "1": {
        identityProb: [0.5, 0.5],
        negatedAtomic: 0,
        negatedComplex: 0,
        predicatesDistribution: [.5, .5, 0], //how many place
        constantsDistribution: {
            mean: 3,
            dev: 1
        },
        objectsDistribution: {
            mean: 5,
            dev: 0.5
        },
        extensionOptions: ["all", "self", "mixed", "none"],
        extensionDistribution: [.2, 0.2, .3, .3], //4
        predicatesVariableConstantRatio: [.3, 0.7]
    },
    "2": {
        identityProb: [0.5, 0.5],
        negatedAtomic: 0,
        negatedComplex: 0,
        predicatesDistribution: [.5, .35, 0.15], //how many place
        constantsDistribution: {
            mean: 4,
            dev: 1
        },
        objectsDistribution: {
            mean: 3,
            dev: 0.5
        },
        extensionOptions: ["all", "self", "mixed", "none"],
        extensionDistribution: [.3, 0.2, .4, .1], //4
        predicatesVariableConstantRatio: [.5, .5]
    }
}

var id = {
    letter: "id",
    place: 2
}

var diff;
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
        string = p + ' : {' + ex.join(', ') + '}'

    } else {

        option = chance.weighted(diff.extensionOptions, diff.extensionDistribution);

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



        }

        newEx = []
        _.each(ex, function(x) {
            var add = true
            for (i in newEx) {
                if (_.isEqual(newEx[i], x)) add = false
            }
            if (add) newEx.push(x)
        })


        ex = newEx.sort()

        if (option == 'none') {
            string +=  p + ": { } "
        } else {
            // tempString = ex[0].split('').join(' , ')
            var string = p + " : {(" + ex[0] + ") ";

            for (var i = 1; i < ex.length; i++) {
                // tempString = ex[i].split('').join(' , ')
                // console.log(ex[i])
                string += ", (" + formatSet(ex[i]) + ")";
            }
            string += '}'
        }


    }
    // console.log(ex)
    out.string = string;
    out.extension = ex;
    return out;
}


function formatSet(set){
  var out = set[0]
  // console.log(set)
  for (var item = 1; item < set.length;item++){
    out += ", " +set[item]
  }
  return out;
}
var Constant = function(name, obj) {
    this.name = name;
    this.referent = obj
}



/////////


////PROPOSITION RELATED

var Proposition = function(model,diff) {
  // console.log(model)
    var o = {
        variables: variables,
        constants: model.names
    }

    left = chance.weighted([model.extensions[chance.pickone(Object.keys(model.extensions))], id], diff.identityProb);
    right = chance.weighted([model.extensions[chance.pickone(Object.keys(model.extensions))], id], diff.identityProb);

    this.left = {
        letter: left.letter,
        place: left.place,
        negated: chance.bool({
            likelihood: diff.negatedAtomic
        })
    }
    this.right = {
        letter: right.letter,
        place: right.place,
        negated: chance.bool({
            likelihood: diff.negatedAtomic
        })
    }

    if (this.left.negated) this.left.prefix = negation
    else this.left.prefix = ""


    if (this.right.negated) this.right.prefix = negation
    else this.right.prefix = ""


    this.negated = chance.bool({
        likelihood: 0
    })
    if (this.negated) this.prefix = negation
    else this.prefix = ""

    // this.qnegated = chance.bool({
    //     likelihood: diff.negatedComplex
    // })
    if (this.negated) this.qprefix = negation
    else this.qprefix = ""

    this.totalPlace = this.left.place + this.right.place;

    this.left.vars = ""
    this.right.vars = ""
    var quantifiersStr = "";


    for (var i = 0; i < this.left.place; i++) {
        //
        // this.left.vars += chance.pickone(o[chance.integer({min:0, max: o.length - 1})])

        // console.log(o)
        this.left.vars += chance.pickone(o[chance.weighted(["variables", "constants"], diff.predicatesVariableConstantRatio)])


    }
    for (var i = 0; i < this.right.place; i++) {
        this.right.vars += chance.pickone(o[chance.weighted(["variables", "constants"], diff.predicatesVariableConstantRatio)])

    }


    var allVars = _.uniq((this.left.vars + this.right.vars).split('')) // combine left and right's variable-string, turn it into an array, then use _ to get rid of dups. this will become quanitifer order
    allVars = _.shuffle(_.filter(allVars, function(x) {
        return _.contains(variables, x)
    }))

    this.allVars = allVars;
    this.quantifiers = {}

    for (v in allVars) {

        this.quantifiers[allVars[v]] = {
            variable: allVars[v],
            quantifier: chance.pickone(diff.quantifiersOptions)
        }

        this.qprefix += this.quantifiers[allVars[v]].quantifier + " " + allVars[v]
    }



    this.connective = chance.pickone(connectives)

    if (this.left.letter == "id") var leftStr = this.left.prefix + " " + this.left.vars[0] + "=" + this.left.vars[1];
    else var leftStr = this.left.prefix + " " + this.left.letter + this.left.vars;

    if (this.right.letter == "id") var rightStr = this.right.prefix + " " + this.right.vars[0] + "=" + this.right.vars[1];
    else var rightStr = this.right.prefix + " " + this.right.letter + this.right.vars;


    this.string = this.qprefix + this.prefix + " ( " + leftStr + " " + this.connective + " " + rightStr + " ) "






}

module.exports.Proposition = Proposition

function initPropSet(model, n, diff) {
    output = []
    var keys = _.allKeys(model.extensions)
    var predicates = chance.pickset(keys, n)
    for (var i = 0; i < n; i++) {
        temp = new Proposition(model, diff)
        output.push(temp)
    }
    return output;
}

function getVal(model, predicateLetter, tuple) {
    // console.log(tuple)
    if (tuple.length == 1) return _.contains(model.extensions[predicateLetter].extension, tuple[0])
    else if (predicateLetter == "id") {
        // console.log("checking if " + tuple[0] + " and " + tuple[1] + " are id..."+check.isIdentical(tuple[0], tuple[1]))
        return check.isIdentical(tuple[0], tuple[1])
    } else {

        // console.log(tuple)

        extension = model.extensions[predicateLetter].extension
        for (pair in extension) {
            if (_.isEqual(extension[pair], tuple)) return true;
        }
        return false
    }



}

function connectiveInterpret(model, l, r, p) {



    v = []
    v[0] = getVal(model, p.left.letter, l)
    v[1] = getVal(model, p.right.letter, r)
        // console.log(v)
    if (p.left.negated) v[0] = !v[0]
    if (p.right.negated) v[1] = !v[1]
    switch (p.connective) {
        case conjunction:
            return (v[0] && v[1]);
        case conditional:
            return (!v[0] || v[1]);
        case disjunction:
            return v[0] || v[1];
        case iff:
            // console.log("iff")
            // console.log(v[0])
            // console.log(v[1])
            // console.log(p.left.letter)
            // console.log(p.left.letter)

            return v[0] == v[1];

    }


}

function recursion(p, model, sub_L, sub_R, targetVar) {
    quantifiers = p.quantifiers;
    left = p.left;
    right = p.right;
    connective = p.connective
    allVars = p.allVars;
    referents = model.referents
    if (sub_L == undefined || sub_R == undefined) {
        sub_L = substite.stringToSet(p.left.vars, referents);
        sub_R = substite.stringToSet(p.right.vars, referents);
    }
    // console.log(check.noVariables(sub_L))
    if (check.noVariables(sub_L) && check.noVariables(sub_R)) {

        out = connectiveInterpret(model, sub_L, sub_R, p)
            // console.log("here? " + !out )
        if (p.negated) return !out;
        else return out;
    }

    if (targetVar == undefined) {
        targetVar = allVars[0]
    }

    if (quantifiers[targetVar].quantifier == every) quantifier = "every"
    else quantifier = "some"

    return out = _[quantifier](model.ud, function(object) {

        sub_L2 = substite.varToObject(sub_L, targetVar, object)
        sub_R2 = substite.varToObject(sub_R, targetVar, object)


        return recursion(p, model, sub_L2, sub_R2, allVars[allVars.indexOf(targetVar) + 1])

    })



}


function eval(p, model, sub_L, sub_R, targetVar) {
    // console.log("evaling " )
    // console.log(JSON.stringify(p, null, 4))
    // console.log(model)
    quantifiers = p.quantifiers;
    left = p.left;
    right = p.right;
    connective = p.connective
    allVars = p.allVars;
    referents = model.referents
    if (sub_L == undefined || sub_R == undefined) {
        // console.log("L : "+ p.left.vars)
        sub_L = substite.stringToSet(p.left.vars, referents);
        sub_R = substite.stringToSet(p.right.vars, referents);
        // console.log(sub_L)

    }

    if (check.noVariables(sub_L) && check.noVariables(sub_R)) {

        out = connectiveInterpret(model, sub_L, sub_R, p)

        if (p.negated) return !out;
        else return out;
    }

    if (targetVar == undefined) {
        targetVar = allVars[0]
    }
    // console.log(targetVar)
    if (quantifiers[targetVar].quantifier == every) quantifier = "every"
    else quantifier = "some"

    return out = _[quantifier](model.ud, function(object) {

        sub_L2 = substite.varToObject(sub_L, targetVar, object)
        sub_R2 = substite.varToObject(sub_R, targetVar, object)


        return eval(p, model, sub_L2, sub_R2, allVars[allVars.indexOf(targetVar) + 1])

    })

}






var substite = {
    varToObject: function(strArr, targetVar, object) {
        var newArr = []
        for (var i = 0; i < strArr.length; i++) {
            if (strArr[i] == targetVar) newArr[i] = object
            else newArr[i] = strArr[i]
        }
        return newArr;
    },
    stringToSet: function(string, referents) {


        var strArr = string.split('');

        var set = []
        for (var i = 0; i < strArr.length; i++) {
            // console.log(referents)
            if (check.isConstant(strArr[i])) set.push(referents[strArr[i]].referent)
            else set.push(strArr[i])
        }

        return set;
    }
}


var check = {
    noVariables: function(x) {

        if (typeof x == "string") return onlyConstant(x)
        else return _.isEmpty(_.intersection(x, variables))
    },
    isIdentical: function(x, y) {
        return x == y
    },
    isConstant: function(x) {
        return _.contains(constants, x);
    },
    isVariable: function(x) {
        return _.contains(variables, x);
    },
    hasConstant: function(x) {
        for (y in x.split('')) {
            if (this.isConstant(y)) return true;
        }
        return false;
    },
    hasVariable: function(x) {
        for (y in x.split('')) {
            if (this.isVariables(y)) return true;
        }
        return false;
    },
    onlyConstant: function(x) {
        return _.every(x.split(''), function(y) {
            return _.contains(constants, y);
        });
    },
    onlyVariable: function(x) {
        return _.every(x.split(''), function(y) {
            return _.contains(variables, y);
        });
    }
}

var makeProblemSet = function makeProblemSet(model, n, diff) {
    p = []
    for (var i = 0; i < n; i++) {
        temp = new Proposition(model, diff)
        tv = eval(temp, model)

        p.push([temp, tv])
    }
    return p;
}

module.exports.makeProblemSet = makeProblemSet

var expScale = require('./generatorHelp.js').expScale

var model1 = function model1(tier){
  tier = parseInt(tier)
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

      var model = initModel(diff)

      return {
        problems: makeProblemSet(model,4,diff),
        model,model
      }

}



module.exports.model1 = model1


var model2 = function(tier){
  tier = parseInt(tier)
  // tier = 7
  if (tier == null) tier = 10
  var  twoPlaceChance = expScale(0.2,0.8,20,tier)
  var  threePlaceChance = expScale(0,Math.min(0.3,1-twoPlaceChance),20,tier)
  var onePlaceChance = 1 - twoPlaceChance - threePlaceChance
  var extensionDistribution  = {"2":expScale(0.3,0.8,20,tier)}
  extensionDistribution[0] = expScale(0,Math.min(0.05,1-extensionDistribution[2]),20,tier)
  extensionDistribution[1] = (1 - extensionDistribution[0] - extensionDistribution[2])/2
  extensionDistribution[3] = extensionDistribution[1]
  var predicateRatio =  expScale(0.5,1,20,tier)

  var diff =  {
      identityProb: [1,0],
      negatedAtomic: expScale(1,4,20,tier)*tier,
      negatedComplex: expScale(0,2,20,tier)*tier,
      predicatesDistribution: [onePlaceChance, twoPlaceChance, threePlaceChance], //how many place
      constantsDistribution: {
          mean: 3,
          dev: 2
      },
      objectsDistribution: {
        mean: tier,
        dev: expScale(0,tier/5,20,tier,true)
      },
      extensionOptions: ["all", "self", "mixed", "none"],
      extensionDistribution: [extensionDistribution[0], extensionDistribution[1], extensionDistribution[2], extensionDistribution[3]], //4
      predicatesVariableConstantRatio: [predicateRatio, 1 - predicateRatio ],
      quantifiersOptions: [every,some]
      }

      var model = initModel(diff)
      console.log(JSON.stringify(model,null,5))
      var demo = makeProblemSet(model,expScale(3,6,20,tier,true),diff)
      console.log(JSON.stringify(demo,null,5))
      return {
        problems: makeProblemSet(model,expScale(3,6,20,tier,true),diff),
        model,model
      }

}

// console.log(JSON.stringify(model2(2),null,2))
module.exports.model2 = model2
model2(2)



testset = [
        ["Moreno", "Moreno"],
        ["Moreno", "Moreno"]
    ]

testModel = {
    referents: {
        g: {
            name: 'g',
            referent: 'Dominican Republic'
        },
        a: {
            name: 'a',
            referent: 'Dominican Republic'
        },
        n: {
            name: 'n',
            referent: 'Laos'
        },
        p: {
            name: 'p',
            referent: 'Paraguay'
        },
        r: {
            name: 'r',
            referent: 'Turkey'
        }
    },
    extensions: {
        G: {
            letter: 'G',
            place: 1,
            string: '<p>G : {  }</p>',
            extension: ["Dominican Republic"]
        },
        D: {
            letter: 'D',
            place: 2,
            string: '<p>D : { Dominican Republic , Laos , Paraguay }</p>',
            extension: [
                ['Dominican Republic', 'Laos']
            ]
        },
        B: {
            letter: 'B',
            place: 1,
            string: '<p>B : {  }</p>',
            extension: []
        },
        J: {
            letter: 'J',
            place: 2,
            string: '<p>J : { ( Laos,Paraguay ) , ( Paraguay,Paraguay ) , ( Paraguay,Turkey ) , ( Turkey,Turkey )  }</p>',
            extension: [
                ["Laos", "Paraguay"],
                ['Paraguay', 'Paraguay']
            ]
        }
    },
    ud: ['Dominican Republic', 'Paraguay', 'Turkey', 'Laos'],
    names: ['g', 'n', 'p', 'r']
}

// console.log(makeProblemSet(testModel,4))
var debug = false

if (debug) {
    var test = require('tape')
    test('evaluation', function(t) {

        pt = {
            left: {
                letter: 'G',
                place: 1,
                negated: false,
                prefix: '',
                vars: 'x'
            },
            right: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'xz'
            },
            negated: false,
            prefix: '\\exists z\\exists x',
            totalPlace: 3,
            allVars: ['z', 'x'],
            quantifiers: {
                z: {
                    variable: 'x',
                    quantifier: '\\forall'
                },
                x: {
                    variable: 'x',
                    quantifier: '\\forall'
                }
            },
            connective: conjunction,
            string: '\\forall z\\forall x (  Gx \\to  x=z ) '
        }

        pt2 = {
            left: {
                letter: 'G',
                place: 1,
                negated: false,
                prefix: '',
                vars: 'x'
            },
            right: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'xz'
            },
            negated: false,
            prefix: '\\exists z\\exists x',
            totalPlace: 3,
            allVars: ['z', 'x'],
            quantifiers: {
                z: {
                    variable: 'x',
                    quantifier: '\\exist'
                },
                x: {
                    variable: 'x',
                    quantifier: '\\exist'
                }
            },
            connective: conjunction,
            string: '\\forall z\\forall x (  Gn \\wedge  n=z ) '
        }

        pt3 = {
            left: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'zz'
            },
            right: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'xx'
            },
            negated: false,
            prefix: '\\exists z\\exists x',
            totalPlace: 4,
            allVars: ['z', 'x'],
            quantifiers: {
                z: {
                    variable: 'x',
                    quantifier: '\\forall'
                },
                x: {
                    variable: 'x',
                    quantifier: '\\forall'
                }
            },
            connective: conjunction,
            string: '\\forall z\\forall x (  Gn \\wedge  n=z ) '
        }

        pt4 = {
            left: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'za'
            },
            right: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'zn'
            },
            negated: false,
            prefix: '\\exists z\\exists x',
            totalPlace: 4,
            allVars: ['z'],
            quantifiers: {
                z: {
                    variable: 'z',
                    quantifier: '\\exists'
                }
            },
            connective: conjunction,
        }

        pt5 = {
            left: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'za'
            },
            right: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'zg'
            },
            negated: false,
            prefix: '\\exists z\\exists x',
            totalPlace: 4,
            allVars: ['z'],
            quantifiers: {
                z: {
                    variable: 'z',
                    quantifier: '\\exists'
                }
            },
            connective: conjunction,
        }
        pt6 = {
            left: {
                letter: 'D',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'xz'
            },
            right: {
                letter: 'J',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'xz'
            },
            negated: false,
            prefix: '\\forall x\\exists z',
            totalPlace: 3,
            allVars: ['z', 'x'],
            quantifiers: {
                z: {
                    variable: 'x',
                    quantifier: '\\forall'
                },
                x: {
                    variable: 'x',
                    quantifier: '\\forall'
                }
            },
            connective: conjunction
        }

        pt7 = {
            left: {
                letter: 'D',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'xz'
            },
            right: {
                letter: 'J',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'zy'
            },
            negated: false,
            prefix: '\\forall x\\exists z',
            totalPlace: 4,
            allVars: ['z', 'x', 'y'],
            quantifiers: {
                z: {
                    variable: 'z',
                    quantifier: '\\exists'
                },
                x: {
                    variable: 'x',
                    quantifier: '\\exists'
                },
                y: {
                    variable: 'y',
                    quantifier: '\\exists'
                }
            },
            connective: conjunction
        }
        t.plan(10)
        t.assert(!eval(pt, testModel))
        t.assert(eval(pt2, testModel))
        t.assert(eval(pt3, testModel))
        t.assert(!eval(pt4, testModel))
        t.assert(eval(pt5, testModel))
        t.assert(!eval(pt6, testModel))
        t.assert(eval(pt7, testModel))

        testModel2 = {
            referents: {
                e: {
                    name: 'e',
                    referent: 'Pena'
                },
                l: {
                    name: 'l',
                    referent: 'Sims'
                },
                r: {
                    name: 'r',
                    referent: 'Rodriquez'
                },
            },
            extensions: {
                T: {
                    letter: 'T',
                    place: 2,
                    string: '<p>D : { Dominican Republic , Laos , Paraguay }</p>',
                    extension: [
                        ['Pena', 'Pena'],
                        ['Rodriquez', 'Rodriquez'],
                        ['Maldonado', 'Maldonado'],
                        ['Sims', 'Sims']
                    ]
                }
            },
            ud: ['Pena', 'Rodriquez', 'Maldonado', 'Sims'],
            names: ['e', 'l', 'r']
        }

        pt8 = {
            left: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'xl'
            },
            right: {
                letter: 'T',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'yl'
            },
            qnegated: false,
            negated: false,
            prefix: '\\forall x\\exists z',
            totalPlace: 4,
            allVars: ['y', 'x'],
            quantifiers: {
                x: {
                    variable: 'x',
                    quantifier: '\\exists'
                },
                y: {
                    variable: 'y',
                    quantifier: '\\exists'
                }
            },
            connective: conjunction
        }

        pt9 = {
            left: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'xx'
            },
            right: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'yy'
            },
            qnegated: false,
            negated: false,
            prefix: '\\exists x\\exists z',
            totalPlace: 4,
            allVars: ['y', 'x'],
            quantifiers: {
                x: {
                    variable: 'x',
                    quantifier: '\\forall'
                },
                y: {
                    variable: 'y',
                    quantifier: '\\forall'
                }
            },
            connective: conjunction
        }
        t.assert(eval(pt8, testModel2))

        t.assert(eval(pt9, testModel2))

        testModel3 = {
            referents: {
                b: {
                    name: 'b',
                    referent: 'Vanuatu'
                },
                i: {
                    name: 'i',
                    referent: 'Maldives'
                },
                o: {
                    name: 'o',
                    referent: 'Vanuatu'
                },
            },
            extensions: {
                D: {
                    letter: 'T',
                    place: 2,
                    string: '<p>D : { Dominican Republic , Laos , Paraguay }</p>',
                    extension: [
                        ['Maldives', 'Maldives'],
                        ['North Korea', 'North Korea'],
                        ['Vanuatu', 'Vanuatu']
                    ]
                }
            },
            ud: ['North Korea', 'Maldives', 'Vanuatu'],
            names: ['b', 'i', 'o']
        }


        pt10 = {
            left: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'yb'
            },
            right: {
                letter: 'id',
                place: 2,
                negated: false,
                prefix: '',
                vars: 'zy'
            },
            qnegated: false,
            negated: false,
            prefix: '\\exists x\\exists z',
            totalPlace: 4,
            allVars: ['y', 'z'],
            quantifiers: {
                y: {
                    variable: 'y',
                    quantifier: '\\exists'
                },
                z: {
                    variable: 'z',
                    quantifier: '\\forall'
                }
            },
            connective: disjunction
        }
        t.assert(eval(pt10, testModel3))
    })
}


module.exports.initModel = initModel;
module.exports.makeProblemSet = makeProblemSet
    // console.log(p)
    // console.log(p[0].quantifiers)
