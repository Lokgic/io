$(function(){
  var help = require('./mods/helpers.js')
  var quizDiv = d3.select('#sl-1-1')
  var qId = quizDiv.attr('id')
  var qInfo = qId.split('-')
  var logged = ($('#mainnavbar').attr('data') == "notLogged") ? false : true;
  var uid = $('#mainnavbar').attr('data')
  var problemSet
  var readingConfirmButt = quizDiv.select('.confirmbutt').style('color', 'white')
  var readingNextButt = quizDiv.select('.nextbutt')
  function loadSyl(callback){
    jQuery.post("/processing/syllogism/list")
    .done(function(data){
        callback(null, data);
    }).fail()
  };

  function sylToString(prob){
    output = {
      question:["Premise 1: "+prob.p1str, "Premise 2: "+prob.p2str, "Conlucsion: "+ prob.cstr],
      pid:prob.form,
      options: ["Valid", "Invalid"]
    }

    output.ans = (prob.valid)? "Valid" : "Invalid"
    return output


  }
    var chosenAnswer;
  loadSyl(function(e,d){

    var problemSet = []
    for (problem in d){
      problemSet.push(sylToString(d[problem]))
    }

    var n = 0;

    printProblem(problemSet[n])
    makeOptionBar(problemSet[n].options)



    var buttStatus = "answer"
    readingConfirmButt.on('click', function(d) {

        if (buttStatus == "answer") {
            var notifyMsg, notifyOption
            if (chosenAnswer == undefined || chosenAnswer == null || chosenAnswer == "") {
                notifyMsg = 'No input detect! You must answer the question before continuing.'
                help.alert(notifyMsg,"incorred")
            } else {

                var toRecord = {
                  pid:problemSet[n].pid,
                  type:qId,
                  uid: uid,
                  input: chosenAnswer
                }
                toRecord.correct = (chosenAnswer == currentP.answer) ? true : false
                over = (problemSet.length == currentPi + 1)

                if (over){
                  $.notify("Exercise completed. Press 'Next' to see the result", {
                      style: 'info',
                      position: "botton right"
                  })
                  buttStatus = "over"
                }else{
                    var msg = 'Answer recorded. Press "Next" to continue. Result will be shown at the end.'
                    help.alert(msg,"info")
                    buttStatus = "next"
                    readingConfirmButt.style('color', "grey")
                    readingNextButt.style('color', "white")
                    chosenAnswer = undefined
                  }



                }


            }

        })



    readingNextButt.on('click', function(d) {
        if (buttStatus == "next") {
            buttStatus = "answer"
            readingConfirmButt.style('color', "white")
            readingNextButt.style('color', "grey")
            n += 1
            updateProblemNum(n + 1, problemSet.length)

            currentP = problemSet[n]

            printProblem(problemSet[n])
            makeOptionBar(problemSet[n].options)
        } else if (buttStatus == "result") {
            console.log("done")
        }


    })

    function updateProblemNum(x, outof) {
        quizDiv.select('.problemNumDisplay').text(x + " out of " + outof)
    }

  })

  function makeOptionBar(options){
    var userOptions = quizDiv.select('.readingExQ').selectAll('div').data([])
        userOptions.exit()
        .transition()
        .style("fill-opacity", function(d) {
            return 1e-6
        })
        .remove();

    var mouseOverColor = '#eee'
    var clickedColor = '#478EB0'
    var originalColor = '#9FB3B6'

    userOptions.data(options).enter()
                .append('button')
                .attr('class','mc')
                .text(function(d){return d})
                .on('mouseover',function(d){
                  d3.select(this).style('background',mouseOverColor)
                }).on('mouseout',function(d){
                  if (d3.select(this).attr('data') == 'clicked'){
                    d3.select(this).style('background',clickedColor)
                  }else{
                    d3.select(this).style('background',originalColor)
                  }

                })
                .on('click',function(d){

                  if (d3.select(this).attr('data') == 'clicked'){
                    d3.select(this).style('background',mouseOverColor)
                    d3.select(this).attr('data','unclicked')
                    chosenAnswer = ""
                  }else{
                    d3.selectAll('.mc').attr('data','unclicked').style('background',originalColor)
                    d3.select(this).style('background',clickedColor)
                    d3.select(this).attr('data','clicked')
                    chosenAnswer = d3.select(this).text()
                  }
                  console.log(chosenAnswer)
                })

              }

      function printProblem(currentP){
        var readingQuestion = quizDiv.select('.readingExQ').selectAll('p').data([])
        readingQuestion.exit()
            .remove();

        readingQuestion.data(currentP.question)
          .enter()
          .append('p')
          .text(function(d, i) {
              return d
          })
          .transition()
          .style('fill-opacity',1)
      }

})
