_ = require('underscore')
sl = require('./truthTable_gen.js')
PriorityQueue = require('./priority-queue.js')
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


var root = treeData

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

function makeRoot(nSen,nLet){
  var l = sl.makeLetters(nLet)
  out = {
    name:"root",
    children:[],
    givens:[]
  }
  for (var i = 0 ;i < nSen;i++){
    if (i!= nSen-1){
      out.givens.push(sl.makeSentence(l,2,1))
    }else{
      var conclusion = sl.makeSentence(l,2,1)
      out.givens.push({
        atomic:true,
        left: conclusion,
        leftnegated:true
      })
    }
  }
  return out
}

// function growTree(root){
//   var q = root.givens
//   var checked = []
//
//   while (q.length != 0){
//
//   }
//
//
//
// }


var a = { atomic: true,
  left:
   { atomic: false,
     left: 'A',
     right: 'F',
     connective: '\\vee',
     leftnegated: false,
     rightnegated: false },

  connective: '\\vee',
  leftnegated: true,
  rightnegated: false }

  var a2 = { atomic: true,
    left:
     { atomic: true,
       left: 'A',
       leftnegated: true,
       rightnegated: false },

    leftnegated: true,
    rightnegated: false }



function branchingCheck(st){
  if (st.connective == and) return false;
  if (st.atomic == true){
    if (st.leftnegated == true){
      if (st.left.atomic && st.left.leftnegated) return false // double negation
      if (st.left.connective == or) return false;
      if (st.left.connective == implies) return false;
    }
  }
  return true;

}

var queue = new PriorityQueue({
  comparator: function(a, b) {
    if (branchingCheck(a) && branchingCheck(b)) return 0;
    else if (branchingCheck(a) && !branchingCheck(b)) return 1;
    else if (!branchingCheck(a) && branchingCheck(b)) return -1;
    }
  }
);

var l = sl.makeLetters(3)
queue.queue(a);
queue.queue(a2);

queue.queue(sl.makeSentence(l,2,1));
queue.queue(sl.makeSentence(l,2,1));
queue.queue(sl.makeSentence(l,2,1));
// var lowest = queue.dequeue(); // returns 5
// var l = sl.makeLetters(4)
// var root = makeRoot(2,2)

console.log(queue.dequeue())
console.log(queue.dequeue())
console.log(queue.dequeue())
console.log(queue.dequeue())
console.log(queue.dequeue())
