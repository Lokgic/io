Chance = require('chance')
_ = require('underscore')
chance = new Chance()

var allLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"]
var or = "\\vee"
var and = "\\wedge"
var neg = "\\neg"
var iff = "\\leftrightarrow"
var implies = "\\to"
var negProbability = {likelihood: 10}
var allConnectives ={
  "1": [or,and],
  "2": [or,and,iff,implies]
}

var connectiveEnglish =
{
  "\\vee": "or",
  "\\wedge": "and"
}

function makeTruthTablebu(letters, sentence) {
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
    // console.log(sl)
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
    } else if (sl.connective == implies){
      return !left || right
    } else if (sl.connective == iff){
      return left == right
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



truthTable1 = function truthTable1(v){
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
    var sen = [makeSentence(l,connectives,complexity)]
    return makeTruthTable(l,sen)

};

module.exports.truthTable1 = truthTable1

function makeTruthTable(letters, sentence) {
  // console.log(sentence)
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

    for (sen in sentence){
      var lastCol = []
      for (var i = 0; i < nRows; i++) {
          var val = {}
          for (var j = 0; j < letters.length; j++) {
              val[letters[j]] = (output[j].column[i] == "T") ? true : false;
          }
          // console.log(val)
          // console.log(evaluateSL(val,sentence))
          evaluateSL(val, sentence[sen]) ? lastCol.push("T") : lastCol.push("F");

      }
      // console.log(slSentencetoString(sentence))
      output.push({
          "name": "$" + slSentencetoString(sentence[sen]) + "$",
          "column": lastCol,
          "atomic":false
      })
    }

    return output;
}


function makeArgument(table){
  var firstPremise = -1
  var conclusion = table.length - 1
  console.log(table)
  var nRow = table[0].column.length
  for (col in table){
    if (!table[col].atomic) {
      table[col].property = checkProperty(table[col].column)
      if (firstPremise < 0) firstPremise = col;
      if (col == table.length - 1){
        table[col].name = "$\\therefore$ " + table[col].name
        table[col].status = 'conclusion'
      }else{
        table[col].status = 'premise'
      }
    }
  }
  var valid = true
  var info

// console.log(firstPremise)
  for (row in table[0].column){
    var truePremises = true
    for (var i = firstPremise;i < conclusion;i++){

      if (table[i].column[row] == "F") {
        truePremises = false
      }
    }
    if (truePremises){
      if (table[conclusion].column[row]=="F") valid = false
    }
  }
  var answer = [];

  for (var i = 0;i< nRow;i++){
    for (var j = firstPremise;j <= conclusion;j++){
      answer.push(table[j].column[i])

    }
  }
  // console.log(answer)
  // console.log(table)

  function checkConsistency(table){
    for (var i = 0;i< nRow;i++){
      var rowVar = []
      for (var j = firstPremise;j <= conclusion;j++){
        rowVar.push(table[j].column[i])
      }
      if (!_.contains(rowVar,"F")) return true;
    }
    return false;

  }


  return {
    valid:valid,
    table:table,
    nRow: nRow,
    firstPremiseIndex: parseInt(firstPremise),
    conclusionIndex: conclusion,
    answer:answer,
    consistent:checkConsistency(table)
  }
}

function checkProperty(col){
  if (_.contains(col,"T")&&_.contains(col,"F")) return "contingent"
  else if (!_.contains(col,"T")) return "contradiction"
  else if (!_.contains(col,"F")) return "tautology"
}

// console.log(checkProperty(['T','T','T']))

truthTable2 = function truthTable2(v){
  var nLet
  var nSen
  var complexity
    if (v == 1){
       nLet = 2;
      complexity = 2
      connectives = 1
      nSen = 2;
    } else if (v == 2){
       nLet = 3;
      complexity = 2
      connectives = 1
      nSen = 3;
      negProbability = {likelihood: 10}
    }else if (v == 3){
      nLet = null;
     complexity = 2
     connectives = 1
     nSen = 4;
     negProbability = {likelihood: 20}
   }else if (v == 4){
      nLet = 4;
     complexity = 2
     connectives = 1
     nSen = 4;
     negProbability = {likelihood: 30}
    }
    var l = makeLetters(nLet)
    var sen = []
    for (var i = 0;i<nSen;i++){
      sen.push(makeSentence(l,connectives,complexity))
    }
    console.log(l)

    return makeArgument(makeTruthTable(l,sen))

};



module.exports.truthTable2 = truthTable2


truthTable3 = function truthTable3(v){
  var nLet
  var nSen
  var complexity
    if (v == 1){
       nLet = 2;
      complexity = 2
      connectives = 2
      nSen = 2;
    } else if (v == 2){
       nLet = 3;
      complexity = 2
      connectives = 2
      nSen = 3;
      negProbability = {likelihood: 10}
    }else if (v == 3){
      nLet = null;
     complexity = 2
     connectives = 2
     nSen = 4;
     negProbability = {likelihood: 20}
   }else if (v == 4){
      nLet = 4;
     complexity = 2
     connectives = 2
     nSen = 4;
     negProbability = {likelihood: 30}
    }
    var l = makeLetters(nLet)
    var sen = []
    for (var i = 0;i<nSen;i++){
      sen.push(makeSentence(l,connectives,complexity))
    }
    console.log(l)

    return makeArgument(makeTruthTable(l,sen))

};

console.log(truthTable3(2))

module.exports.truthTable3 = truthTable3


function makeRandomEnglish(){
  switch (chance.integer({min: 0, max: 3})){
    case 0: return chance.first() + " is from " + chance.country({ full: true });
            break;
    case 1: return   chance.first() + " lives in " + chance.city();
            break;
    case 2: return chance.first() +" loves " +chance.first()
            break;
    case 3: return chance.first() +" hates " +chance.first()
            break;
  }

}

 function symbolizationKey(letters){
  //  console.log(letters)
   var output = {

   }

   for (letter in letters){
     output[letters[letter]] = makeRandomEnglish()
   }
   return output;
 }

 function slSentencetoEnglish(sl,key) {
   var pun = false;
   var not = "it is not the case that "
     if (sl.atomic) {
         return (sl.leftnegated) ? not + key[sl.left] : key[sl.left]
     }
     if (typeof sl.left != "string") {
       var left = slSentencetoEnglish(sl.left,key);
       pun = true}
     else var left =key[sl.left]
     if (typeof sl.right != "string") var right = slSentencetoEnglish(sl.right,key)
     else var right = key[sl.right]
     if (sl.leftnegated) left = not + left;
     if (sl.rightnegated) right = not + right;
     if (pun) var ou = left +", "+ connectiveEnglish[sl.connective] + " " + right
    else var ou = left +" "+ connectiveEnglish[sl.connective] + " " + right
     return ou;

 }

module.exports.slEnglish = function(){
  var out = []
  for (var i = 0;i<10;i++){
    out.push(complexEnglish())
  }

  return out;
}


function complexEnglish(){
  negProbability = {likelihood: 10}
   var seedReal = chance.integer({min: 2, max: 3})
   var seedFake = (chance.bool())? seedReal -1 : seedReal +1;
   var letters = makeLetters()
   var keys = symbolizationKey(letters)
   var target = makeSentence(letters,1,seedReal)
   var alt = makeSentence(letters,1,seedFake)
   var realEnglish = slSentencetoEnglish(target,keys)
   var fakeEnglish = slSentencetoEnglish(alt,keys)
   realEnglish =fix(realEnglish);
   fakeEnglish = fix(fakeEnglish);

   function fix(str){

    var newStr = str[0].toUpperCase()+str.slice(1) +".";
    // console.log(newStr)
    return newStr;
    }

    slAlt = "$"+slSentencetoString(alt) +"$"
    slReal = "$"+slSentencetoString(target)+"$"
    choices = _.shuffle([slAlt,slReal])
    var q = []
    for (k in keys){
      q.push(k+": "+keys[k])
    }
    q.push(realEnglish)
   return {
     question:q,
     choices:choices,
     answer:slReal
   }


 }



// console.log(l)



// console.log(test)
// console.log(slSentencetoString(test))
  // console.log(complexEnglish())
// console.log(slSentencetoString(test))
//
// console.log(test)
// console.log(makeTruthTable(l,test))
// // console.log(makeLetters())
