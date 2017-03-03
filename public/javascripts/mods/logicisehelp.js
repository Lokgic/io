
var logiciseTracker = function(parm){
  this.logiciseCategory = parm.logiciseCategory
  this.toPass = parm.toPass
  this.currentScore = 0
  this.state = "init"
  this.logiciseId = parm.logiciseId
  this.module = parm.module
  this.scoreDisplay = d3.select('#score')
  this.difficulty = 0
  this.chanceLeft = parm.chanceLeft

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
    recordCompletion(uid,this.module,"logicise",this.logilogiciseId)
    document.getElementById('passingscore').innerHTML ="&#10004;"
    alert('You have passed the logicise!','correctblue')
  }

}

logiciseTracker.prototype.addScore = function (){
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
    if (this.currentScore <8) this.difficulty = 5
    else if (this.currentScore >= 8&& this.currentScore <= 18) this.difficulty = 10
    else if (this.currentScore > 18) this.difficulty = 15
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
  if (this.chanceLeft > 0){
    this.chanceLeft -= 1;
    alert("This is incorrect. :( You have "+ this.chanceLeft +" left. Press confirm to continue.","incorred")
    this.state = "nextProblem"
  } else{
    alert("This is incorrect. :( You have no more chance left. Press confirm to restart.","incorred")
    this.state = "restart"
  }

}

logiciseTracker.prototype.loadProblem = function (arg,callback){
    if (arg == "exp") arg = this.difficulty
    var url = '/processing/'+this.logiciseCategory+'/'+this.logiciseId+'/'+arg
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
  if (this.currentChoice == null) alert("No input detected!","important")
  else{
    if (this.currentChoice == this.currentAnswer){
      me.addScore()
      me.updateStatus()
    } else{

      me.mistake()
    }
  }
}

logiciseTracker.prototype.nextState = function(){
  var me = this
  // console.log(me.drawProblem)
  var nextState = {
    "init":"drawProblem",
    "userInput":"checkAnswer",
    "nextProblem":"nextProblem"
  }
  me[nextState[me.state]]()

}
//
// logiciseTracker.prototype.nextProblem = function(){
//   var me = this
//   // console.log(me.drawProblem)
//   var nextState = {
//     "init":"drawProblem",
//     "userInput":"checkAnswer",
//     "nextProblem":"nextProblem"
//   }
//   me[nextState[me.state]]()
//
// }
