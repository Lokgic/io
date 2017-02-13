_ = require('underscore')
sl = require('./truthTable_gen.js')
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

function growTree(root){
  var q = root.givens
  var checked = []

  while (q.length != 0){
    
  }



}

var l = sl.makeLetters(4)

console.log(makeRoot(2,2))
