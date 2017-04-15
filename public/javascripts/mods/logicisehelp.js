
var logiciseTracker = function(parm){
  this.default = parm
  this.logiciseCategory = parm.logiciseCategory
  this.toPass = parm.toPass
  this.currentScore = 0
  this.state = "init"
  this.logiciseId = parm.logiciseId
  this.module = parm.module
  this.scoreDisplay = d3.select('#score')
  this.difficulty = 0
  this.chanceLeft = parm.chanceLeft
  this.noAtt = (parm.noAtt)? true : false;

  this.butt = {
    confirm:{
      d3obj: d3.select('#confirm')
    },
    2:{
      d3obj:d3.select('#butt2')
    },
    3:{
      d3obj:d3.select('#butt3')
    }
  }
  var me = this
  if (logged) {
    $.post('/checkPassed/pl/logicise/'+this.logiciseId)
    .done(function(d){
      if (d){
        me.passed = d;
        document.getElementById('passingscore').innerHTML = me.toPass +"&#10004;";
      } else{
        document.getElementById('passingscore').innerHTML = me.toPass;
      }

    })
    .fail(function(d){
      console.log(d)
    })
  } else{
    document.getElementById('passingscore').innerHTML = "Not logged";
  }




}

logiciseTracker.prototype.enableButt = function(n,text){
  this.butt[n].d3obj.classed('invisible',false).text(text)

}

logiciseTracker.prototype.disableButt = function(n,text){
  this.butt[n].d3obj.classed('invisible',true)

}
logiciseTracker.prototype.passingWatcher = function passingWatcher(){
  if (this.currentScore >= this.toPass && !this.passed && logged){
    this.passed = true;
    recordCompletion(uid,this.module,"logicise",this.logiciseId)
    document.getElementById('passingscore').innerHTML ="&#10004;"
    alert('You have passed the logicise!','correctblue')
  }

}

logiciseTracker.prototype.addScore = function (){
  if (this.analytic != null) this.analytic.correct += 1

  alert("Correct! You earned a score of "+this.multipler + ".","correctblue")
  this.state = "nextProblem"
  this.currentScore += this.multipler
}

logiciseTracker.prototype.updateStatus = function updateStatus(){
  var me = this
  this.currentAnswer = null;
  this.passingWatcher();
  this.scoreDisplay.text(me.currentScore)

  if (!logged){
    this.difficulty = Math.max(7,this.currentScore)
    this.multipler = 2
  } else{
    expInit(uid,function(d){

      me.difficulty = d.lvl
      me.multipler = Math.ceil(me.difficulty/5)
      // difficulty = 14
      d3.select('#difficulty').text(me.difficulty+("(+"+ me.multipler+")"))
      // d3.select('#passingscore').text(toPass)
      d3.select('#chance').text(me.chanceLeft)
    })
  }
}

logiciseTracker.prototype.floatInfo = function(html){
  this.floatInfoState = 'hidden'
  d3.select('body')
    .append('div')
    .attr('class','floatInfo')
    .html(html)
}

logiciseTracker.prototype.restart = function(){
  this.currentScore = 0
  this.chanceLeft = this.default.chanceLeft
  this.problemSet = []
  this.currentChoice = null;
  this.updateStatus()
  this.nextProblem()
}

logiciseTracker.prototype.floatInfoToggle = function(){
  var me = this
  if (this.floatInfoState == "hidden"){
    d3.select('.floatInfo').style('left', '10px').on('click',function(d){
      me.floatInfoToggle()
    })
    this.floatInfoState = "shown"
  }else{
    d3.select('.floatInfo').style('left', '-9999')
    this.floatInfoState = "hidden"

  }


}


logiciseTracker.prototype.mistake = function(){
  if (this.analytic != null) this.analytic.incorrect += 1

  if (this.chanceLeft > 0){
    this.chanceLeft -= 1;
    alert("This is incorrect. :( You have "+ this.chanceLeft +" left. Press confirm to continue.","incorred")
    this.state = "nextProblem"
  } else{
    alert("This is incorrect. :( You have no more chances left. Press confirm to restart. If you passed and are signed in, your score will show up on the leaderboard.","incorred")
    if (logged && this.currentScore >= this.toPass) recordLeader(uid,this.logiciseId,this.currentScore)
    if (this.analytic) this.analytic.sendDB(this.analyticId)
    this.state = "restart"
  }

}

logiciseTracker.prototype.loadProblem = function (arg,callback){
    if (arg == "exp") {
      this.updateStatus()
      console.log(this.difficulty)
      arg = this.difficulty
    }
    var url = '/processing/'+this.logiciseCategory+'/'+this.logiciseId+'/'+arg
    // console.log(url)
    $.post(url)
    .done(function(d){
      callback(d)
    })
  }

logiciseTracker.prototype.cleanDisplay = function(){
  d3.select('#display').html("")
}

logiciseTracker.prototype.enableTutorial = function(){
  d3.select('#tutorial').on('click', function(){
    $('#messageModal').modal('toggle')
  })
}

logiciseTracker.prototype.checkAnswer = function(){
  var me = this
  if (this.currentChoice == null || _.contains(this.currentChoice, null)) alert("Incomplete response!","important")
  else{
    if (logged && !me.noAtt){
      var att = {
        uid:uid,
        pid:this.currentProblem.string,
        type:this.logiciseId,
        input:this.currentChoice,
        correct:this.currentChoice == this.currentAnswer

      }
    sendAttempts(att)
    }
    if (this.currentChoice == this.currentAnswer||_.isEqual(this.currentAnswer,this.currentChoice)){
      console.log("correct")
      me.addScore()
    } else{
      console.log("incorrect")
      me.mistake()
    }
    me.updateStatus()
    if (me.feedback){
      me.feedback()
    }
  }
}



logiciseTracker.prototype.nextState = function(){
  var me = this
  // console.log(me.drawProblem)
  var nextState = {
    "init":"drawProblem",
    "userInput":"checkAnswer",
    "nextProblem":"nextProblem",
    "restart":"restart"
  }
  me[nextState[me.state]]()

}


var modelStatDataObject = function(uid){

    this.uid = uid
    this.reset()




}

var connectiveKey = {
  "\\vee":"disjunction",
  "\\wedge":"conjunction",
  "\\to":"conditional",
  "\\leftrightarrow":"biconditional",
  "\\forall":"universal",
  "\\exists":"existential"
}

modelStatDataObject.prototype.connecitveCount = function(c){
  this[connectiveKey[c]] += 1;
}

modelStatDataObject.prototype.sendDB = function(note){
  // console.log("sending")
  this.note = note;
  var dat = this
  console.log(dat)
  $.ajax({
      url: '/statData/modelstat',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(dat),
      dataType: 'json',
      success: function(res) {
          //On ajax success do this
          console.log(res)
          console.log("message " + res.message)
      },
      error: function(res) {
          //On ajax success do this
          console.log(res)
          console.log("error message " + res.message)
      }
  });
  this.reset()
}

modelStatDataObject.prototype.reset = function(c){
  this.depth = 1
  this.udSize = 0
  this.constants = 0
  this.onePlace = 0
  this.twoPlace = 0
  this.threePlace = 0
  this.conditional = 0
  this.disjunction = 0
  this.biconditional = 0
  this.conjunction = 0
  this.negation = 0
  this.universal = 0
  this.existential = 0
  this.correct = 0
  this.incorrect = 0
  this.identity = 0
  this.note = ""

}

modelStatDataObject.prototype.processModel = function(d){
  msData = this
  msData.udSize = d.model.ud.length
  msData.constants = _.keys(d.model.referents).length
  var place = [0,0,0]
  var extLen = 0
  for (ex in d.model.extensions){
    extLen += d.model.extensions[ex].extension.length
    place[d.model.extensions[ex].place - 1] += 1
  }
  console.log(place)
  for (problem in d.problems){
    if (d.problems[problem][0].negated) msData.negation += 1
    if (d.problems[problem][0].left.negated) msData.negation += 1
    if (d.problems[problem][0].right.negated) msData.negation += 1

     msData.connecitveCount(d.problems[problem][0].connective)
     for (q in d.problems[problem][0].quantifiers){
       msData.connecitveCount(d.problems[problem][0].quantifiers[q].quantifier)
     }
  }
  msData.extensionMean = Math.round(extLen/_.keys(d.model.extensions).length)
  msData.onePlace = place[0]
  msData.twoPlace = place[1]
  msData.threePlace = place[2]
}
