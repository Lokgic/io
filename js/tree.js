Chance = require('chance')

_ = require('underscore')
chance = new Chance()
PriorityQueue = require('./priority-queue.js')
var allLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"]
var or = "\\vee"
var and = "\\wedge"
var neg = "\\neg"
var iff = "\\leftrightarrow"
var implies = "\\to"
var allConnectives ={
  "1": [or,and],
  "2": [or,and,iff,implies]
}

    var treeData = {
      "name":"a",
      "children":[
        {"name":"b",
        children:[
          {"name":"c"},
          {"name":"d"}
        ]},
        {
          "name":"d"
        }
      ]
    }

var comparator = {
  comparator: function(a, b) {
    if (branchingCheck(a) && branchingCheck(b)) return 0;
    else if (branchingCheck(a) && !branchingCheck(b)) return 1;
    else if (!branchingCheck(a) && branchingCheck(b)) return -1;
    }
  }




function BFS(root){
  var explored = []
  var toSearch = []
  toSearch.push(root)
  while(toSearch.length > 0){
    var n = toSearch.shift()
    if (!_.contains(explored,n.name)) explored.push(n.name)
    if (n.children){
      for (child in n.children){
        toSearch.push(n.children[child])
      }
    }
  }
  return explored
}


var makeLetters = function makeLetters(n){
  if (n == null){
    n = chance.integer({min: 2, max: 4})
  }
  // console.log(n)
  return chance.pickset(allLetters,n)
}


var makeSLSentence = function makeSLSentence(letters,conectivesGroup,upper,negProbability){
  negProbability = negProbability == null? {likelihood: 5}:{likelihood: negProbability};
  var numOfLettter = chance.integer({min: Math.max(letters.length,2), max: letters.length+upper})
  var all = letters.slice();
  if (numOfLettter != letters.length){ //pick random letters for extra letters
    var temp = _.sample(letters,numOfLettter - letters.length)
    Array.prototype.push.apply(all, temp)
  }
  all = _.shuffle(all)
  // console.log(all)
  var substr = [] //parts of wffs
  if (all.length%2 != 0){ //if number is odd, make one singleton first
    substr.push(new slSentence(all.shift()))
    // console.log(substr)
  }
  for (var i = 0;i<all.length;i++){ //now but doubleton
    substr.push(new slSentence(all.shift(),chance.bool(negProbability), chance.pickone(allConnectives[conectivesGroup]),all.shift(), chance.bool(negProbability)))
  }

  if (substr.length == 1) return substr[0] //only 1 - no need to put together
  substr = _.shuffle(substr)
  var output = new slSentence(substr.shift(),chance.bool(negProbability),chance.pickone(allConnectives[conectivesGroup]),substr.shift(), chance.bool(negProbability))
  while (substr.length!=0){
    output = new slSentence(output,chance.bool(negProbability),chance.pickone(allConnectives[conectivesGroup]),substr.shift(), chance.bool(negProbability))
  }

  return output
}


var slSentence = function(l, nl, c, r, nr, mainNegProb) {
    mainNegProb = (null)? 10 : mainNegProb;
    this.mainNeg = chance.bool(mainNegProb)
    if (typeof l == "string" && r == null) {
        this.atomic = true
    } else this.atomic = false;

    this.left = l,
    this.right = r,
    this.connective = c,
    this.leftnegated = nl,
    this.rightnegated = nr
}







function branchingCheck(st){
  if (st.connective == and && !st.mainNeg) return false;
  else if (st.connective == or && st.mainNeg) return false;
  else if (st.connective == implies && st.mainNeg) return false;
  else if (st.right == null && st.mainNeg && st.left.manNeg) return false;
  return true;

}


function Node(data){
  this.data = data,
  this.parent = null,
  this.children = []
}

function Tree(data) {
    var node = new Node(data);
    this._root = node;
}


function makeTree(nSen,nLet){
  var l = makeLetters(nLet)
  var givens = []
  for (var i = 0 ;i < nSen;i++){
    if (i!= nSen - 1){
      givens.push(makeSLSentence(l,1,1))
    }else {
      givens.push({
        "mainNeg":true,
        "left":makeSLSentence(l,1,1)
      })
    }

  }

  return new Tree(givens)
}

function growTree(node){

}

var l = makeLetters(3)


var tree = makeTree(1,2)
console.log(JSON.stringify(tree, null, 4));
