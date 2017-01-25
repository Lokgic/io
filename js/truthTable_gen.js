Chance = require('chance')
_ = require('underscore')
chance = new Chance()

var allLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"]
var or = "\\vee"
var and = "\\wedge"
var neg = "\\neg"
var negProbability = {likelihood: 10}
var allConnectives ={
  "1": [or,and]
}

function makeTruthTable(letters, sentence) {
  console.log(sentence)
    var nRows = Math.pow(2, letters.length)
    var output = []
    var k = nRows / 2
    for (l in letters) {
        var col = {}
        col.name = "$" + letters[l] + "$"
        var temp = []
        var current = "T"
        while (temp.length < nRows) {
            for (var i = 0; i < k; i++) {
                temp.push("T")
            }
            for (var i = 0; i < k; i++) {
                temp.push("F")
            }
        }
        col.column = temp
        col.atomic = true
        output.push(col)
        k = k / 2
    }
    var lastCol = []
    for (var i = 0; i < nRows; i++) {
        var val = {}
        for (var j = 0; j < letters.length; j++) {
            val[letters[j]] = (output[j].column[i] == "T") ? true : false;
        }
        // console.log(val)
        // console.log(evaluateSL(val,sentence))
        evaluateSL(val, sentence) ? lastCol.push("T") : lastCol.push("F");

    }
    // console.log(slSentencetoString(sentence))
    output.push({
        "name": "$" + slSentencetoString(sentence) + "$",
        "column": lastCol,
        "atomic":false
    })
    return output;
}

var slSentence = function(l, nl, c, r, nr) {
    if (l == null || r == null) {
        this.atomic = true
    } else this.atomic = false;
    this.left = l,
        this.right = r,
        this.connective = c,
        this.leftnegated = nl,
        this.rightnegated = nr
}

function slSentencetoString(sl) {
    if (sl.atomic) {
        return (sl.leftnegated) ? "\\neg " + sl.left : sl.left
    }
    if (typeof sl.left != "string") var left = slSentencetoString(sl.left)
    else var left = sl.left
    if (typeof sl.right != "string") var right = slSentencetoString(sl.right)
    else var right = sl.right
    if (sl.leftnegated) left = "\\neg " + left;
    if (sl.rightnegated) right = "\\neg " + right;
    return "(" + left + sl.connective + " " + right + ")"

}

// console.log()
function evaluateSL(vals, sl) {
    //  console.log(typeof sl.left  != "string")
    console.log(sl)
    if (sl.atomic) {
        return (sl.leftnegated) ? !vals[sl.left] : vals[sl.left];
    }
    if (typeof sl.left != "string") var left = evaluateSL(vals, sl.left)
    else var left = vals[sl.left]
    if (typeof sl.right != "string") var right = evaluateSL(vals, sl.right)
    else var right = vals[sl.right]
    if (sl.leftnegated) left = !left;
    if (sl.rightnegated) right = !right;
    //  console.log(true && false)
    //  console.log(left && right)
    if (sl.connective == and) {
        return left && right
    } else if (sl.connective == or) {
        return left || right
    }

}

function makeLetters(n){
  if (n == null){
    n = chance.integer({min: 2, max: 4})
  }
  // console.log(n)
  return chance.pickset(allLetters,n)
}

function makeSentence(letters,level,diff){
  var numOfLettter = chance.integer({min: Math.max(letters.length,2), max: letters.length+diff})
  var all = letters.slice();
  if (numOfLettter != letters.length){
    var temp = _.sample(letters,numOfLettter - letters.length)
    Array.prototype.push.apply(all, temp)
  }
  all = _.shuffle(all)
  // console.log(all)
  var substr = []
  if (all.length%2 != 0){
    substr.push(new slSentence(all.shift(),chance.bool(negProbability)))
    // console.log(substr)
  }
  for (var i = 0;i<all.length;i++){
    substr.push(new slSentence(all.shift(),chance.bool(negProbability), chance.pickone(allConnectives[level]),all.shift(), chance.bool(negProbability)))
  }

  if (substr.length == 1) return substr[0]
  substr = _.shuffle(substr)
  var output = new slSentence(substr.shift(),chance.bool(negProbability),chance.pickone(allConnectives[level]),substr.shift(), chance.bool(negProbability))
  while (substr.length!=0){
    output = new slSentence(output,chance.bool(negProbability),chance.pickone(allConnectives[level]),substr.shift(), chance.bool(negProbability))
  }

  return output
}

module.exports.truthTable1 = function(v){
  var nLet
  var complexity
    if (v == 1){
       nLet = 2;
      complexity = 1
      connectives = 1
    } else if (v == 2){
       nLet = 3;
      complexity = 1
      connectives = 1
      negProbability = {likelihood: 30}
    }else if (v == 3){
       nLet = null;
      complexity = 2
      connectives = 1
      negProbability = {likelihood: 30}
    }
    var l = makeLetters(nLet)
    var sen = makeSentence(l,connectives,complexity)
    return makeTruthTable(l,sen)


};



// console.log(l)
// test = makeSentence(l,1,2)
//
// console.log(test)
// console.log(makeTruthTable(l,test))
// // console.log(makeLetters())
