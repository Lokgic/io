$(function(){
  var ruleText = d3.select('#display').append('p').attr('class','text-xs-center m-y-3 h4')
  var display = d3.select('#display')
  var svg = display.append('svg')
  var toPass = 2
  var timeDisplay = d3.select('.subNav').append('p').attr('class','display-4 m-y-0')
  var currentScore = 0
  score = d3.select('#score')


  var html = ' <p>You will be shown a set of cards. Each card must have a number on one side and a letter on the other. (For instance, there will be no card with numbers on both sides.)</p>'
      html += '<p><em>Your task is to turn over the <strong>minimum</strong> number of cards required to determine whether the statement is true or false.</em></p>'
      html += '<p>Choose by clicking the card(s) and then press "Confirm". You have to start over if you make a mistake. Get the score of ' + toPass + ' or above to pass the logicise.</p>'
      html += '<p>You can adjust the difficulty by increasing or decreasing the number of cards by pressing + or -. You get more points from playing with a higher number of cards: Number of points possible = number of cards showing. </p>'
      html += '<p><strong>Note:</strong> There is no card with the number 0 or 1. If you see something that looks like them, it is either the vowel O or the vowel I.</p>'
      html += 'Press "Confirm" to start.'

  d3.select('#tutorial').on('click',function(){
    var head = "Instruction"


    modalMsg(head,html)
  })
modalMsg("Introduction",html)
  // d3.select('#display').html(html)
  var difficulty = 1
  var bonus = false;
  var bonusChance = .05

  var state = "next"
  var currentProblem;
  var chance = 1;

  var timer = new Timer({
      tick : 1,
      ontick : function (millisec) {
        var sec = Math.round(millisec / 1000)
        timeDisplay.text(sec)
          console.log('interval', sec);
      },
      onstart : function() {
          console.log('timer started');
      },
      onend: function(){
        alert('Time is up! You did not answer the bonus question. You will not be penalized. Press Confirm to continue.', "incorred")
        state  = "next"
        timeDisplay.text('')
      },
      onstop: function(){
        timeDisplay.text('')
      }
  });


  function updateStatus(){
    score.text(currentScore)
    if (currentScore <8) difficulty = 1
    else if (currentScore >= 8&& currentScore <= 18) difficulty = 2
    else if (currentScore > 18) difficulty = 2
    d3.select('#difficulty').text(difficulty)
    d3.select('#passingscore').text(toPass)
    d3.select('#chance').text(chance)

  }
  updateStatus()



  d3.select('#confirm').on('click',function(){
    console.log(state)
    if (state == "next"){
      // if (state == "intro") d3.select('#display').selectAll('p').remove()

      state ="input"
      wasonInit(difficulty)
    }else if (state == "input"){
      var pass = true
      var rightCount = 0
      for (card in currentProblem.model.domain){
        if (currentProblem.model.domain[card].answer == currentProblem.model.domain[card].selected ){ currentProblem.model.domain[card].correct = true
        rightCount += 1;
      }else {
          currentProblem.model.domain[card].correct = false
          pass = false
        }

      }

      var att = {
        uid:uid,
        pid:difficulty,
        type:"wason1",
        input:rightCount+"/"+currentProblem.model.domain.length,
        correct:pass
      }
      sendAttempts(att);
      console.log(currentProblem)
      d3.selectAll('rect').attr('fill',function(d){
        if (d.correct) return '#444C5C'
        else return '#A43820'
      })

      if (pass){
        alert('This is correct. Press confirm to continue','correctblue')
        currentScore += 1;
        state = "next"
        updateStatus()

      }else {
        if (chance != 0){
          chance -= 1;
          alert('This is incorrect. You have '+ chance+' left. Press confirm to continue. Incorrect selection(s) is red, otherwise blue.','incorred')
          state ="next"
          updateStatus()

        }else {
          var msg
          if (currentScore => passingscore){
            msg = "This is incorrect! You have passed the logicise. Press confirm to restart."
            recordCompletion(uid,"sl","logicise","wason1")
            recordLeader(uid,"wason1",currentScore)
          } else {
            msg = "This is incorrect! Unfortunately you did not reach the passing score. Press confirm to restart."
          }
          modalMsg('Result',msg)
          updateStatus()

          state = "restart"

        }
      }
    }else if (state == "restart") {
      location.reload()
    }else if (state == "bonus"){
      timer.stop()
      var pass = true
      var rightCount = 0;
      for (card in currentProblem.model.domain){
        if (currentProblem.model.domain[card].answer == currentProblem.model.domain[card].selected ){
          currentProblem.model.domain[card].correct = true;
          rightCount += 1;

        }
        else {
          currentProblem.model.domain[card].correct = false
          pass = false
        }

      }


      var att = {
        uid:uid,
        pid:difficulty,
        type:"wason1",
        input:rightCount+"/"+currentProblem.model.domain.length,
        correct:pass
      }
      sendAttempts(att);

      d3.selectAll('rect').attr('fill',function(d){
        if (d.correct) return '#444C5C'
        else return '#A43820'
      })
      if (pass){
        alert('This is correct. You get a bonus of 5 points!','correctblue')
        currentScore += 5;
        state = "next"
        updateStatus()

      } else{

          alert('This is incorrect! However no point is being taken away!','incorred')
          // currentScore += 5;
          state = "next"
          updateStatus()


      }
    }


  })
  function wasonInit(difficulty){
    bonus = Math.random() <= bonusChance
    var difficulty = (bonus) ? 4: difficulty;
    if (bonus) {
      timer.start(120)
      alert('RANDOM BONUS PROBLEM! Solve the problem before the timer ends to get 5 points. You will not be penalized for giving an incorrect answer.',"important")
      state = "bonus"
    }
      loadLogicise("wason","wason1/"+difficulty,function(err, d){
        currentProblem = d
        // console.log(d.rule.toString)
        ruleText.text(d.rule.string)
        // d3.select('svg').remove()
        var deck = drawCard(d.model.domain, svg)
        deck.cards.on('mouseover',function(d){
          console.log(d)
          d3.select(this)
          .attr('stroke','#E1B378')
          .attr('stroke-width',0)
          .transition()
          .attr('stroke-width',10)
        })
        .on('mouseout',function(d){
          console.log(d)
          d3.select(this)
          .attr('stroke','none')
        })
        .on('click',function(d){
          d.selected = (d.selected)? false: true;
          d3.select(this)
              .attr('fill',function(){
                if (d.selected) return "#663300"
                else return "black"
              })
        })

      })


  }



  function drawCard(model,svg){
    var width = $('#interaction').width()
    var padding = 30;
    var cardMargin = 30;
    var cardWidth = (width)/4 - padding
    var topMargin = 30
    var height = (cardWidth + cardMargin)*Math.ceil(model.length/4) +padding
    svg.attr('width',width)
    .attr('height',height)
    console.log(model)
    svg.selectAll('rect').remove()


        svg.selectAll('rect').data(model).enter()
        .append('rect')
        .attr("x", function(d,i){
          return (i%4)*cardWidth + 2*cardMargin
        })
        .attr('y',function(d,i){
          return Math.floor(i/4) * cardWidth +cardMargin +topMargin
        })
        .attr('rx',20)
        .attr('ry',20)
        .attr('fill','111')
        .attr('stroke','none')

        svg.selectAll('rect').transition().duration(200)
        .attr('width',cardWidth - cardMargin)
        .attr('height',cardWidth - cardMargin)

      svg.selectAll('text')
      .remove()

      svg.selectAll('text')
      .data(model)
      .enter()
      .append('text')
      .text(function(d){
        return d.face.toUpperCase()
      })
      .attr("x", function(d,i){
        return ((i%4)*cardWidth + 1.5*cardMargin) + cardWidth/2
      })
      .attr('y',function(d,i){
        return Math.floor(i/4) * cardWidth + 1.8*cardMargin +topMargin + cardWidth/2
      })
      .attr('fill',function(d){

        return (d.color == "blue")?"#79BEDB" : "#EC799A";
      })
      .attr('text-anchor','middle')
      .attr('font-size',cardWidth*0.6)
      .attr('opacity',0)

        svg.selectAll('text').transition().duration(500)
        .attr('opacity',1)

      return {
        cards:svg.selectAll('rect'),
        text:  svg.selectAll('text')
      }


  }

})
