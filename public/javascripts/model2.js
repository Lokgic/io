$(function(){
  var toPass = 30
  // var timeDisplay = d3.select('.subNav').append('p').attr('class','display-4 m-y-0')
  var currentScore = 0
  var passed = false;
  var chance = 2;
  var buttonState = "next"
  var answer = []
  var input = []
  var difficulty
  score = d3.select('#score')



  if (logged) {
    $.post('/checkPassed/pl/logicise/model2')
    .done(function(d){
      if (d){
        passed = d;
        document.getElementById('passingscore').innerHTML = toPass +"&#10004;";
      } else{
        document.getElementById('passingscore').innerHTML = toPass;
      }

    })
    .fail(function(d){
      console.log(d)
    })
  } else{
    document.getElementById('passingscore').innerHTML = "Not logged";
  }

  function passingWatcher(){
    if (currentScore >= toPass && !passed && logged){
      passed = true;
      recordCompletion(uid,"pl","logicise","model2")
      document.getElementById('passingscore').innerHTML ="&#10004;"
      alert('You have passed the logicise!','correctblue')
    }

  }

  function updateStatus(){
    passingWatcher();
    score.text(currentScore)
    if (!logged){
      if (currentScore <8) difficulty = 5
      else if (currentScore >= 8&& currentScore <= 18) difficulty = 10
      else if (currentScore > 18) difficulty = 15
    } else{
      expInit(uid,function(d){
        difficulty = d.lvl
        // difficulty = 14
        d3.select('#difficulty').text(difficulty+("(+"+ Math.ceil(difficulty/5)+")"))
        // d3.select('#passingscore').text(toPass)
        d3.select('#chance').text(chance)
      })
    }
  }
  updateStatus()



  var msData = new modelStatDataObject(uid);
  function loadModel(callback){

    $.post('/processing/model/model2/'+difficulty)
    .done(function(d){
      console.log(d)
      callback(d)
    })
  }

  function formatTxt(txt){
    return "<p>"+txt+"</p>"
  }

    function loadTable(tier){



      loadModel(function(d){
        var data = []
        input =[]
        answer = []
        var col1 = {
          "name":"PL Wffs",
          "column":[]
        }
        answer = []
        input = []
        var modelTxt = "<p><b>UD</b>: {" + d.model.ud[0]

        for (var i = 1; i<d.model.ud.length;i++){
          modelTxt += ", "+d.model.ud[i]
        }
        modelTxt+= "}</p>"
        for (ext in d.model.extensions){
          modelTxt += formatTxt(d.model.extensions[ext].string)
        }
        for (ext in d.model.referents){
          modelTxt += formatTxt("<b>"+d.model.referents[ext].name+"</b>: "+ (d.model.referents[ext].referent))
        }


        d3.select('#display').append('div').attr('class','col-md-12 p-a-3').attr('id','modelTxt').html(modelTxt)

        var col2 = {
          "name": "Truth Values",
          "column":[]
        }
        for (pl in d.problems){
          col1.column.push("$"+d.problems[pl][0].string+"$")
          col2.column.push(d.problems[pl][1])
          answer.push(d.problems[pl][1])
        }
        d3.select('#display').append('div').attr('class','col-md-12 p-a-3').attr('id','tableSpace')
        var toTab = [col1,col2]
        tabulate(toTab, '#tableSpace',"fill2")

        mathJax.reload('#display')

        d3.selectAll('.blank').on('click',function(d,i){
          if ( buttonState == "answer"){
            if  (d3.select(this).text() == "True") {
              input[i] = answer[i] == false
              d3.select(this).text("False")
            }else {
              d3.select(this).text("True")
              input[i] = answer[i] == true
            }
          }
        })

         msData.processModel(d)


    })


  }

  d3.select('#confirm').on('click',function(){
    // var tempMem = []
    if (buttonState == "restart") location.reload()
    else if (buttonState == "next"){
      d3.select('#display').html("")

      loadTable()
      buttonState = "answer"
    } else if (buttonState == "answer"){
      if (input.length != answer.length) return alert('Table incomplete!', 'important')

      buttonState = "next"
      d3.selectAll('.blank').each(function(d,i){

        if (input[i]){
          d3.select(this).attr('class','correctTableCell')

        } else if (input[i] == false){
           d3.select(this).attr('class','incorrectTableCell')

        }


      })
      _.each(input,function(t){
        if (t) msData.correct += 1;
        else msData.incorrect += 1;
      })
      // console.log(msData)
      msData.sendDB('set')
      var correct
      if (!_.every(input, function(ans){return ans})){
        if (chance != 0){
          chance -= 1;
          alert('This is incorrect. You have '+ chance+' left. Press confirm to continue. Incorrect selection(s) is red, otherwise blue.','incorred')
          state ="next"
          updateStatus()

        }else {
          var msg
          // console.log(currentScore)
          // console.log(passingscore)
          if (currentScore >= toPass){
            msg = "This is incorrect! Your score is now on the leaderboard. Press confirm to restart."
            if (logged) recordLeader(uid,"model2",currentScore)
          } else {
            msg = "This is incorrect! Unfortunately you did not reach the score needed to be on the leaderboard. Press confirm to restart."
          }

          modalMsg('Result',msg)
          updateStatus()

          buttonState = "restart"

        }
        correct = false

      }else {
        alert('This is correct. Press confirm to continue','correctblue')
        currentScore += Math.ceil(difficulty/5);
        updateStatus()
        correct = true
      }
      // var att = {
      //   uid:uid,
      //   pid:2,
      //   type:"model",
      //   input:"",
      //   correct:correct
      // }
      //
      // console.log(att)
      // if (logged) sendAttempts(att);
      updateStatus()

    }

  })

})
