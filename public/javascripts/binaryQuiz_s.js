$(function(){
  var help = require('./mods/helpers.js')
  var quizDiv = d3.select('#sl-1-1')
  var qId = quizDiv.attr('id')
  var qInfo = qId.split('-')
  var logged = ($('#mainnavbar').attr('data') == "notLogged") ? false : true;
  var uid = $('#mainnavbar').attr('data')
  var width = $('#sl-1-1').width()

  function loadSyl(callback){
    jQuery.post("/processing/syllogism/list")
    .done(function(data){
        callback(null, data);
    }).fail()
  };

    function sylToString(prob){
      // console.log(prob)
      var ans = (prob.valid)? "valid": "invalid";
      return {
        uid:uid,
        type:"categorical",
        question:[prob.p1str,prob.p2str, "Therefore: "+ prob.cstr],
        pid:prob.form,
        options: ["Valid", "Invalid"],
        input:null,
        correct:null,
        answer:ans
      }

    }

    loadSyl(function(e,d){
      var n = 0;
      var problemSet = []
      for (problem in d){
        problemSet.push(sylToString(d[problem]))
      }

      quizDiv.select('.readingExQ').selectAll('div')
              .data(problemSet).enter(function(d){return d})
              .append('div').attr('class',function(d,i){
                return 'binaryChoice-orignal offScreen'
              })
                .html(function(d){
                var str = d.question[0]+"<br>"+d.question[1]+"<br>"+d.question[2]
                return str
              })


              quizDiv.select('.confirmButt').on('click',function(d){
                d3.selectAll('.binaryChoice-clicked').attr('id',function(d){console.log(d)})
              })

              var next = quizDiv.select('.nextButt').on('click',function(d){
                d3.select(this).classed('offScreen',true)
                if (n==0){
                  quizDiv.select('.QuizIntro').remove()
                  userInput.classed('invisible',false)

                }
                userInput.classed('invisible',false);
                quizDiv.selectAll('.binaryChoice-orignal').attr('class',function(d,i){
                  return (i==n)?  'binaryChoice-orignal' :'binaryChoice-orignal offScreen'
                })


              })

              var buttons = [
                {"name":"Valid","data":"valid"},
                {"name":"Invalid","data":"invalid"}
              ]

              var userInput = d3.select('.readingExAns')
                .selectAll('button')
                .data(buttons)
                .enter()
                .append('button')
                .attr('class','btn btn-block btn-greyish invisible')
                .text(function(d){
                  return d.name
                })
                .attr('data',function(d){

                  return d.data;
                })
                .on('click',function(d){
                  problemSet[n].input = d.data;
                  problemSet[n].correct = (problemSet[n].answer == problemSet[n].input)? true: false;
                  userInput.classed('invisible',true);
                  var over = (n + 1 == problemSet.length)

                  if (over){
                    // showAnswer
                    if (logged) {
                      sendData(problemSet)
                      recordCompletion();
                    }

                    help.alert("You have answered every question. Press 'Show Answer' to see the result.","info")
                    quizDiv.select('.showAnswerButt').classed('invisible',false).on('click',function(){
                      makeResult(problemSet)
                    })
                  }else{
                    help.alert("Your input has been recorded. Press 'Next' to continue","info")
                    next.classed('offScreen',false)
                    n +=1;

                  }

                })

                function recordCompletion(){
                  var data = {
                      uid: uid,
                      module: qInfo[0],
                      chapter: qInfo[1],
                      section: qInfo[2]
                  }
                  $.ajax({
                      url: '/data/record',
                      type: 'POST',
                      contentType: 'application/json',
                      data: JSON.stringify(data),
                      dataType: 'json',
                      success: function(res) {
                          //On ajax success do this
                          console.log(res)
                          console.log("success message " + res.message)
                      }
                  });
                }
                function sendData(problemSet){
                  var toSend = []
                  problemSet.forEach(function(prob){
                    toSend.push(_.pick(prob, 'uid', 'pid','type','input','correct'));
                  })

                  // console.log(toSend)
                  $.ajax({
                      url: '/data/attempt',
                      type: 'POST',
                      contentType: 'application/json',
                      data: JSON.stringify(toSend),
                      dataType: 'json',
                      success: function(res) {
                          //On ajax success do this
                          console.log(res)
                          console.log("success message " + res.message)
                      },
                      error: function(res) {
                          //On ajax success do this
                        console.log(res)
                          console.log("error message " + res.message)
                      }
                  });
                }

                function makeResult(problemSet){


                  var rWidth = quizDiv.node().getBoundingClientRect().width;
                  var rHeight = window.innerHeight*.5
                  var barPadding = 10;
                  var container = quizDiv.select('.readingExQ').style('height',rHeight).style('weight',rWidth)
                  container.html('')
                  container.append('p').attr('class','text-xs-center').text('Quiz result - click the bar to see more info.')
                  var svg = container.append('svg').attr('width',rWidth).attr('height',rHeight)
                  var color = d3.scaleOrdinal(d3.schemeCategory10);
                  var dataset = []
                  dataset = [{"name":"Correct",data:[]},{"name":"Incorrect",data:[]}]
                  for (var i = 0;i<problemSet.length;i++){
                    var obj = {
                      "name":"Problem " + (i+1),
                      data:{
                        question:problemSet[i].question,
                        input:problemSet[i].input,
                        answer:problemSet[i].answer
                        }
                    }
                    if (problemSet[i].correct) dataset[0].data.push(obj)
                    else dataset[1].data.push(obj)
                  }
                  // console.log(dataset)
                  var widthScale = d3.scaleLinear()
                                      .domain([0,problemSet.length])
                                      .range([0,rWidth - 30])

                  var xMargin = 30;
                  var yMargin = 80
                  var barHeight = Math.min((rHeight / dataset.length)*.80,50)
                  var yMult = barHeight + 30;
                  var bars = svg.selectAll("rect")
                      .data(dataset)
                      .enter()
                      .append("rect")

                   bars.attr("x", function(d, i) {
                         return xMargin;
                       })
                       .attr("y", function(d,i){
                         return i*yMult +yMargin
                       })
                       .attr("width", 0)
                       .attr("height", barHeight)
                  			.transition()
                  			.duration(200)
                  			.delay(function (d, i) {
                  				return i * 50;
                  			})
                       .attr("width", function(d){return widthScale(d.data.length) })
                       .attr('fill',function(d){return color(d.name)})



                       bars.on('click',function(d){
                         var br = "<br>"
                         var modalBody = d3.select('.modal-body')
                         modalBody.html("")
                         d3.select('.modal-title').text(d.name);
                         modalBody.selectAll('div').data(d.data).enter().append('div').html(
                           function(dp){
                             str = "<h4>"+dp.name+"</h4><p>"
                              dp.data.question.forEach(function(qstr){
                                str += qstr+br
                              })
                              str += "Answer: " +dp.data.answer+br
                              str += "Input: " + dp.data.input+br
                              str += "</p>"
                              // console.log(str)
                              return str;
                           }
                         )
                         $('.modal').modal('toggle')

                       })
                       .on('mouseover',function(){
                         d3.select(this).attr('fill',"yellow")
                       })
                       .on('mouseout',function(d){
                         d3.select(this).attr('fill',color(d.name))

                       })


                  svg.selectAll("text") .data(dataset) .enter() .append("text")
                  .text(function(d) {

                    return d.name + " " + d.data.length +"/"+problemSet.length;
                  })
                  .attr("x", function(d, i) {
                    return widthScale(d.data.length) + xMargin/2 ;
                  })
                  .attr("y", function(d,i){
                    return i*yMult +yMargin + barHeight/2
                  })
                  .attr('fill','black')
                  .attr("text-anchor","end")
              

                }

    })




})
