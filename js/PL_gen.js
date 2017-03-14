var Chance = require('chance')
var chance = new Chance();
var _ = require('underscore');
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
