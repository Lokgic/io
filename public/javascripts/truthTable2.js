$(function(){
  function load(v,callback){
    jQuery.post("../processing/truthTable/truthTable2/"+v)
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
  var bonus = false;
  var bonusChance = .05
  d3.select('#difficulty').text(difficulty)
  // var dropdowns = d3.select('#control').append('div').attr('id','dropdown')

  var u = 0
  var state = "input"
  var currentProblem;
  var chance = 1;
  d3.select('#chance').text(chance)

  d3.select('#tutorial').on('click',function(){
    var head = "Instruction"
    var body = "<p>In this logicise, you will be asked to fill out various truth tables and then determine whether the argument is valid and/or consistent. You will be given the values of the atomic sentences and you will have to infer the truth values for the complex sentence.</p><p> You have one second chance, if you happened to get one wrong answer. After that, any incorrect response means that you would have to start over!</p><p>The exercise starts slow with easy complex sentences, but get progressively more difficult later on, as you get higher score. Toward the end, expect to see tables with 16 rows (i.e., 4 sentence letters).You need a score of" + toPass + " or above to pass this exercise.</p>"
    modalMsg(head,body)
  })

  function prepPropertyQuestion(currentProblem){
    var dropdownHtml = ""
      for (var i = currentProblem.firstPremiseIndex;i <=currentProblem.conclusionIndex;i++){
        dropdownHtml += "<span>" + currentProblem.table[i].name + "</span>"
        dropdownHtml += (makeDropdown(currentProblem.table[i].property,["contingent","contradiction","tautology"],"dropdown"+i))
      }
      return dropdownHtml
  }

  var timeDisplay = d3.select('.subNav').append('p').attr('class','display-4 m-y-0')


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


  function makeProblem(difficulty){
    bonus = Math.random() <= bonusChance
    var diff = (bonus) ? 4: difficulty;
    if (bonus) timer.start(150)
    load(diff,function(err,data){
      console.log(data)
      if (bonus) alert('Random bonus problem. Answer the problem correct before the end of the timer to get 5 points. You will not be penalized by answering the question incorrectly.', 'incorred')
      currentProblem = data;
      u = u + 1;
      var con = d3.select('#display').append('div').attr('class','tableContainer')
      var table = tabulate(currentProblem.table,'.tableContainer',"fill")
      var input = table.selectAll('.blank')
      input.on('mouseover',function(d){
        if (state == "input"){
          $(this).parent().css('background','#eee')
          // $(this).css('background','#ccc')
        }

      })
      .on('mouseout',function(d){
        if (state == "input"){
          $(this).parent().css('background','#fff')
          // $(this).css('background','#fff')
        }
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
      // dropdowns.selectAll('select').remove()
      // dropdowns.html(prepPropertyQuestion(currentProblem))
      // d3.selectAll('select')
      // .on('change', function() {
        // console.log()
        // console.log("hi")
        // d3.select(this).attr('data',d3.event.target.value)
      // })
      mathJax.reload()


    })



  }



  var validButt = d3.select('#butt2')
                .classed('invisible',false)
                .text('Is the argument valid?')
                .attr('data','')
                .on('click',function(d){
                  if (d3.select(this).attr('data')=="true"){
                    d3.select(this).attr('data', false)
                                    .text('Argument not valid.')
                  } else{
                    d3.select(this).attr('data',true)
                                    .text('Argument valid.')
                  }
                })

    var consistencyButt = d3.select('#butt3')
                  .classed('invisible',false)
                  .text('Is the argument consistent?')
                  .attr('data','')
                  .on('click',function(d){
                    if (d3.select(this).attr('data')=="true"){
                      d3.select(this).attr('data', false)
                                      .text('Argument inconsistent.')
                    } else{
                      d3.select(this).attr('data',true)
                                      .text('Argument consistent.')
                    }
                  })


  // var dropdowns =[]


  var button = d3.select('#confirm')
  button.on('click',function(){
    if (bonus) timer.stop()
    if (state == "input"){
      state = "next"
      // for (row in currentProblem.column){
      //   input.push(d3.select('#row'+row).attr('data'))
      // }
      console.log(currentProblem)
      var index
      // for (pro in currentProblem){
      //   if (currentProblem[pro].atomic == false) {
      //     index = pro
      //     break;
      //   }
      // }
      var correct = true
      var tableCorrect = true
      var validCorrect = true
      var propertyCorrect = true
      d3.selectAll('.blank').each(function(d,i){
        // var nRow = currentProblem.table()
        // console.log(d3.select(this).attr('data') +" "+ currentProblem[2].column[i])
        if(d3.select(this).attr('data') != currentProblem.answer[i]){
          d3.select(this).style('background', '#BF718A')
          correct = false;
          tableCorrect = false;
        }else{
          d3.select(this).style('background', '#6677C4')

        }
      })
      if (validButt.attr('data') != currentProblem.valid +"") {
        validCorrect = false
        correct = false
        alert("validity: incorrect.","incorred","bottom middle","#butt2")
      } else{
        alert("validity: correct.","correctblue","bottom middle","#butt2")

      }

      var consistencyCorrect = true

      if (consistencyButt.attr('data') != currentProblem.consistent +"") {
        consistencyCorrect = false
        correct = false
        alert("consistency: incorrect.","incorred","bottom middle","#butt3")
      } else{
        alert("consistency: correct.","correctblue","bottom middle","#butt3")

      }
      // dropdownValues = []
      // for (var i = currentProblem.firstPremiseIndex;i<=currentProblem.conclusionIndex;i++){
      //   dropdownValues.push(currentProblem.table[i].property)
      // }
      // console.log(dropdownValues)
      // d3.selectAll('select').each(function(){
      //   dropdownValues.push(d3.select(this).attr('data'))
      // })
      // console.log(dropdownValues)
      input = "tableCorrect-" + tableCorrect + "-validCorrect-"+validCorrect
      // console.log(input)
      var att = {
        uid:uid,
        pid:difficulty,
        type:"truthTable2",
        input:input,
        correct:correct
      }
      sendAttempts(att);
      if (correct) {
        if (bonus){
          currentScore += 5;
          score.text(currentScore);
          timer.stop()
          alert("You answered the bonus question correctly! Press 'confirm' again to continue.","correctblue")
          bonus = false
        }else{
          currentScore += 1;
          score.text(currentScore);
          alert("This is correct! Press 'confirm' again to continue.","correctblue")
        }


      }
      else{
        if (bonus){
          state ="next"
          alert("This is incorrect! But you will not be penalized for missing the bonus question.","incorred")
          bonus = false
        }
        else if (currentScore < toPass && chance == 0){
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
          recordCompletion(uid,"sl","logicise","truthTable2")
          recordLeader(uid,"truthTable2",currentScore)
          state = "restart"
        }

      }
    }else if (state == "next"){
      if (currentScore >= 3) difficulty = 2;
      else if (currentScore >= 11) difficulty =3 ;
      d3.select('#difficulty').text(difficulty)
      makeProblem(difficulty)
      state = "input"
      validButt.text('Is the argument valid?').attr('data',"")
    }else if (state == "restart"){
      location.reload();
    }
  })

  makeProblem(difficulty)
})
