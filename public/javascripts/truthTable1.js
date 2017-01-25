$(function(){
  function load(v,callback){
    jQuery.post("../processing/truthTable/truthTable1/"+v)
    .done(function(data){
        callback(null, data);
    }).fail(function(){$body.append('Failed to Load Quiz')})
  };
  var toPass = 15
  d3.select('#passingscore').text(toPass)
  var currentScore = 0
  score = d3.select('#score')
  score.text(currentScore)
  var difficulty = 1
  d3.select('#difficulty').text(difficulty)


  var u = 0
  var state = "input"
  var currentProblem;
  var chance = 1;
  d3.select('#chance').text(chance)

  d3.select('#tutorial').on('click',function(){
    var head = "Instruction"
    var body = "<p>In this logicise, you will be asked to fill out various truth tables. You will be given the values of the atomic sentences and you will have to infer the truth values for the complex sentence.</p><p> You have one second chance, if you happened to get one wrong answer. After that, any incorrect response means that you would have to start over!</p><p>The exercise starts slow with easy complex sentences, but get progressively more difficult later on, as you get higher score. Toward the end, expect to see tables with 16 rows (i.e., 4 sentence letters).You need a score of" + toPass + " or above to pass this exercise.</p>"
    modalMsg(head,body)
  })

  function makeProblem(difficulty){

    load(difficulty,function(err,data){
      currentProblem = data;
      u = u + 1;
      var con = d3.select('#display').append('div').attr('class','tableContainer')
      var table = tabulate(currentProblem,'.tableContainer',"fill")
      var input = table.selectAll('.blank')
      input.on('mouseover',function(d){
        if (state == "input") d3.select(this).style('background','#eee')
      })
      .on('mouseout',function(d){
        if (state == "input") d3.select(this).style('background','#fff')
      })
      .on('click',function(d){
        if (state == "input"){
          if (d3.select(this).attr('data') == "T"){
            d3.select(this).attr('data','F')
            d3.select(this).text('F')
          }else {
            d3.select(this).attr('data','T')
            d3.select(this).text('T')
          }
        }


      })
      mathJax.reload()

    })



  }


  var button = d3.select('#confirm')
  button.on('click',function(){
    if (state == "input"){
      state = "next"
      // for (row in currentProblem.column){
      //   input.push(d3.select('#row'+row).attr('data'))
      // }
      console.log(currentProblem)
      var index
      for (pro in currentProblem){
        if (currentProblem[pro].atomic == false) {
          index = pro
          break;
        }
      }
      var correct = true
      d3.selectAll('.blank').each(function(d,i){
        // console.log(d3.select(this).attr('data') +" "+ currentProblem[2].column[i])
        if(d3.select(this).attr('data') != currentProblem[index].column[i]){
          d3.select(this).style('background', 'red')
          correct = false;
        }else{
          d3.select(this).style('background', 'blue')

        }
      })

      var att = {
        uid:uid,
        pid:difficulty,
        type:"truthTable1",
        input:currentProblem[index].name,
        correct:correct
      }
      sendAttempts(att);
      if (correct) {
        currentScore += 1;
        score.text(currentScore);
        alert("This is correct! Press 'confirm' again to continue.","correctblue")

      }
      else{
        if (currentScore < toPass && chance == 0){
          modalMsg("Result","This is incorrect! Press 'confirm' again to restart. Unfortunately you did not pass.")
          state = "restart"



        }else if (chance > 0){
          chance -= 1;
          alert("This is incorrect! Incorret values are highlighted in red. You have " + chance + " left before having to start over.","incorred")
          d3.select('#chance').text(chance);
          state = "next"
        }else if (currentScore >= toPass && chance == 0){
          chance -= 1;
          modalMsg("Result","This is incorrect! Incorret values are highlighted in red. You have passed the test!")
          recordCompletion(uid,"sl","logicise","truthTable1")
          recordLeader(uid,"truthTable1",currentScore)
          state = "restart"
        }

      }
    }else if (state == "next"){
      if (currentScore == 3) difficulty += 1;
      else if (currentScore == 11) difficulty += 1;
      d3.select('#difficulty').text(difficulty)
      makeProblem(difficulty)
      state = "input"
    }else if (state == "restart"){
      location.reload();
    }
  })

  makeProblem(difficulty)
})
