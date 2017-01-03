Chance = require('chance')
_ = require('underscore')
chance = new Chance()
valid = ['AAA1','EAE1','EIO1','AII1','AEE2','EAE2','EIO2','AOO2','IAI3','OAO3','AII3','AEE4','IAI4','EIO4']



function generateSyl(){
  mood = ['A','E','I','O']
  figure = ['1','2','3','4']
  if (chance.bool({likelihood:30})) return chance.pickone(valid)
  else return chance.pickone(mood) + chance.pickone(mood) + chance.pickone(mood) + chance.pickone(figure)
}

function checkValidity(syl){

  o = valid.indexOf(syl)
  // console.log(o)
  return (o != -1)
}

 function Syllogism(terms){
  s = terms.s;
  p = terms.p;
  m = terms.m;
  this.terms = terms;
  this.form =  generateSyl(),
  this.valid = checkValidity(this.form)
  this.figure = this.form[3]
  this.p1mood = this.form[0]
  this.p2mood = this.form[1]
  this.cmood = this.form[2]
  this.c = [s,p]
  switch (this.figure) {
    case "1": {
      this.p1 = [m,p]
      this.p2 = [s,m]
      break;
    }
    case "2": {
      this.p1 = [p,m]
      this.p2 = [s,m]
      break;

    }
    case "3": {
      this.p1 = [m,p]
      this.p2 = [m,s]
      break;

    }
    case "4": {
      this.p1 = [p,m]
      this.p2 = [m,s]
      break;

    }

  }
  var placeholder = ['p1','p2','c']
  for (place in placeholder){
    if (this[placeholder[place]+"mood"] == "A") this[placeholder[place]+"str"] = "All " + this[placeholder[place]][0] +" are " +this[placeholder[place]][1]+"."
    else if (this[placeholder[place]+"mood"] == "E") this[placeholder[place]+"str"] = "No " + this[placeholder[place]][0] +" are " +this[placeholder[place]][1] +"."
    else if (this[placeholder[place]+"mood"] == "I") this[placeholder[place]+"str"] = "Some " + this[placeholder[place]][0] +" are " +this[placeholder[place]][1] +"."
    else if (this[placeholder[place]+"mood"] == "O") this[placeholder[place]+"str"] = "Some " + this[placeholder[place]][0] +" are not " +this[placeholder[place]][1] + "."

  }
  this.diagram = new Diagram(m, p, s)
  diagram = this.diagram;
  pMood = this.p1mood + this.p2mood
  for (mood in pMood){
    if (pMood[mood] == "A"){
      var pID= "p"+(parseInt(mood) + 1)

      diagram.area[this[pID][0]] = true
      var words = sorter([this[pID][0],getThird(this.terms, this[pID])],[m,p,s])
      diagram.area[words[0]+"_"+words[1]] = true
    } else if (pMood[mood] == "E"){
      var pID= "p"+(parseInt(mood) + 1)
      var words = sorter(this[pID],[m,p,s])
      diagram.area[words[0]+"_"+words[1]] = true
      diagram.area[m+"_"+p+"_"+s] = true
    }
  }
  var  cCenter = m+"_"+p+"_"+s
  var index = 0
  for (mood in pMood){
    var pID= "p"+(parseInt(mood) + 1)
    if (pMood[mood] == "I"){
      var words = sorter(this[pID],[m,p,s])
      diagram.objects[index].exists = true;
      var temp = words[0] + "_" + words[1]
      str = ""
      if (!this.diagram.area[cCenter]) diagram.objects[index].loc = cCenter
      else {
        third = [m,p,s].indexOf(getThird(this.terms, this[pID]))

        for (var i = 0; i <3;i++){
          if (this[pID].indexOf([m,p,s][i]) != -1) str += ([m,p,s][i] == m)? m: "_" + [m,p,s][i]
            else str += "-" +[m,p,s][i]

        }
        diagram.objects[index].loc = str
      }


      index += 1;



    } else if (pMood[mood] == "O"){
      diagram.objects[index].exists = true;
      var temp = this[pID][0]
      var third = getThird(this.terms, this[pID])
      var temp2 = sorter([temp, third],[m,p,s])
      var intersection = temp2[0]+"_"+temp2[1]
      console.log(temp + ' '+ third)
      if (diagram.area[intersection]) diagram.objects[index].loc = temp
      else diagram.objects[index].loc = (temp2[0] == temp)? "-" +intersection: "+"+intersection

      index += 1;
    }
  }

}

function Diagram(m,p,s){

  this.area = {
  }

  this.area[m] = false

  this.area[p] = false
  this.area[s] = false
  this.area[m+"_"+p] = false
  this.area[m+"_"+s] = false
  this.area[p+"_"+s] = false
  this.area[m+"_"+p+"_"+s] = false



  this.objects = [
    {
      exists:false,
      loc:""
    },
    {
      exists:false,
      loc:""

    }
  ]



}


function sorter(toSort,order){
  return _.sortBy(toSort,function(obj){
    return order.indexOf(obj)
  })
}

function getThird(terms,sentence){

  return  _.difference(terms, sentence)[0]
}
function termsInit(json){
    var dogs = require('../public/json/'+json+'.json');

    output = []
    if (chance.bool({likelihood:15})) output.push("dogs")
    if (chance.bool({likelihood:15})) output.push("animals")
    if (chance.bool({likelihood:15})) output.push("mammals")
    if (chance.bool({likelihood:15})) output.push("canines")

    while (output.length <3){
      var temp = chance.pickone(dogs.children)
      temp = (chance.bool({likelihood:50}))? temp.name: chance.pickone(temp.children);
      if (output.indexOf(temp) == -1) output.push(temp)
    }
    output = chance.shuffle(output)
    // console.log(output)
    var terms = {}

     terms.s = output[0]
     terms.p = output[1]
     terms.m = output[2]

     return terms

  }
console.log(new Syllogism(termsInit("dogs")))
module.exports.makeStuff = function(){
  return new Syllogism( termsInit("dogs"));
};
