
$(function(){
  var logged = ($('#mainnavbar').attr('data') == "notLogged")? false :true;
  var sid = $('#mainnavbar').attr('data')
  console.log(userId)
  var quizDiv = d3.select('.quizTemplate')
  var qId = quizDiv.attr('id')
  var problemSet;
  var mainContainer = "#"+qId

  var scope = d3.select(mainContainer)
  var leftMargin = 50
  var topMargin = 100
  var selected
  var chosenAnswer
  var wheel
  var wheelText
  var readingConfirmButt = scope.select('.confirmButt').style('color', 'white')
  var readingNextButt = scope.select('.nextButt')
  var colorScale = d3.scaleOrdinal(d3.schemeSet1)
  var wheelScale = d3.scaleLinear()
      .domain([0, 3])
      .range([0.3, 0.7])
  var wheelAltScale = d3.scaleLinear()
      .domain([0, 3])
      .range([0.75, 1])
  var ansH = window.innerHeight / 2
  var ansW = $(mainContainer+ ' .readingExAns').width()
  var barHeight = 50;
  var ansDiv = scope.select('.readingExAns')
      // .append('svg')
      // .attr('width', ansW)
      // .attr('height', ansH)
      // .append('g')
      // .attr('transform', 'translate(' + (ansW / 2) + ',' + (ansH / 2) + ')');


function makeOptionBar(options){
  var userOptions = ansDiv.selectAll('div').data([])
  userOptions.exit()
      .transition(tran)
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






  var ansRadius = Math.min(ansH, ansW) / 10;
  var textRadius = ansRadius + 10
  var ansArc = d3.arc()
      .innerRadius(ansRadius / 3)
      .outerRadius(ansRadius)
  var ansLabelArc = d3.arc()
      .innerRadius(textRadius)
      .outerRadius(textRadius + 50)
  var collapsedArc = d3.arc()
      .innerRadius(1)
      .outerRadius(1)
  var tran = d3.transition()
      .duration(700)
  var outcome = []
  var pie = d3.pie()
      .value(function(d) {
          return 1;
      })
      .sort(null);

  function loadProblems(option,callback){
    jQuery.post("/problem/"+option)
    .done(function(data){
        callback(null, data);
    }).fail(function(f){console.log(f)})
  };



  function wheelTransition(choices) {


      var newText = ansSVG.selectAll('text')
          .data([])

      newText.exit()
          .transition(tran)
          .style("fill-opacity", function(d) {
              return 1e-6
          })
          .remove();


      newText.data(pie(choices), function(d) {
              return d.data
          })
          .enter().append("text")
          .style("fill-opacity", 1e-6)
          .text(function(d) {
              return d;
          })
          .attr("transform", function(d) {
              return "translate(" + ansLabelArc.centroid(d) + ")";
          })
          .attr("dy", ".35em")
          .text(function(d) {
              return d.data
          })
          .attr('fill', 'black')
          .attr('font-size', "1em")
          .attr('text-anchor', function(d, i) {
              var textX = ansLabelArc.centroid(d)[0]
              if (textX > 0) return (textX > 1) ? "start" : "middle"
              else if (textX < 0) return (textX < -1) ? "end" : "middle"
          })
          .transition(tran)
          .style("fill-opacity", 1);

      var newWheel = ansSVG.selectAll('path')
          .data([])
      newWheel.exit()
          .transition(tran)
          .attr('stroke', 'white')
          .style("stroke-width", 90)
          .remove();

      newWheel.data(pie(choices), function(d) {
              return d.data
          })
          .enter()
          .append('path')
          .attr('status', 'original')
          .attr('d', ansArc)
          .attr('fill', function(d, i) {
              return colorScale(d.data);
          })
          .transition(tran)
          .attr('stroke-width', 30)
          .attr('stroke', 'white')

      ansSVG.selectAll('path').on('mouseover', function(d, i) {
              if (d3.select(this).attr('status') != 'clicked') wheelClick(this, d.data)
          })
          .on('mouseout', function(d, i) {
              if (d3.select(this).attr('status') != 'clicked') wheelOriginalColor(this, d.data)
          })
          .on('click', function(d, i) {
              if (d3.select(this).attr('status') != 'clicked') {
                  ansSVG.selectAll('path').attr('status', 'unclicked')
                  ansSVG.selectAll('path').attr('fill', function(d, i) {
                      wheelOriginalColor(this, d.data)
                  })
                  wheelClick(this, d.data)
                  d3.select(this).attr('status', 'clicked')
                  chosenAnswer = d.data
              } else {
                  wheelOriginalColor(this, d.data)
                  d3.select(this).attr('status', 'original')
              }


          })


  }



  function wheelOriginalColor(target, d) {

      d3.select(target)
          .transition()
          .duration(200)
          .attr('fill', colorScale(d))
          .attr('stroke-width', 30)

  }

  function wheelClick(target, i) {
      d3.select(target)
          .transition()
          .duration(200)
          .attr('fill', '#B7AFA3')
          .attr('stroke-width', 10)
  }

  var buttStatus = "answer"
  readingConfirmButt.on('click', function(d) {

      if (buttStatus == "answer") {
          var notifyMsg, notifyOption
          if (chosenAnswer == undefined || chosenAnswer == null || chosenAnswer == "") {
              notifyMsg = 'No input detect! You must answer the question before continuing.'
              notifyOption = {
                  style: 'incorred',
                  position: "botton right"
              }
          } else {

              var toRecord = {
                pid:currentP.pid,
                type:currentP.type,
                sid: sid,
                sinput: chosenAnswer
              }
              toRecord.correct = (chosenAnswer == currentP.answer) ? true : false
              over = (problemSet.length == currentPi + 1)
              var notifyOption = (toRecord.correct) ? {
                  style: 'correctblue',
                  position: "botton right"
              } : {
                  style: "incorred",
                  position: "bottom right"
              }
              if (toRecord.correct){
                notifyMsg = 'Correct. Press "Next" to continue.'
              } else{
                notifyMsg = 'This is incorrect. Press "Next" to continue.'
                makeAnswer(currentProblem)
              }
              $.notify(notifyMsg, notifyOption);
              if (over){
                $.notify("You have answered all questions!", {
                    style: 'info',
                    position: "botton right"
                });
                buttStatus = "over"
              } else{
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
          currentPi += 1
          updateProblemNum(currentPi + 1, problemSet.length)

          currentP = problemSet[currentPi]

          makeOptionBar(currentP.options)
          print(currentP)
      } else if (buttStatus == "result") {
          console.log("done")
      }


  })

  function updateProblemNum(x, outof) {
      scope.select('.problemNumDisplay').text(x + " out of " + outof)
  }

  function createResult(outcome) {
      if (type == "text"){
        var currentContainerHeight = $(mainContainer).height()
        $(mainContainer).css("height", currentContainerHeight).css('overflow', 'scroll')
        readingQ.html('')
        scope.select('.readingExAns').html('')
        readingQ.selectAll('div')
            .data(outcome)
            .enter()
            .append('div')
            .attr('id',"result"+i)
            .attr('class', 'readingExResults')
            // .style('background-color', function(d) {
            //     return (d.correct) ? "#336B87" : "#763626"
            // })
            .html(function(d, i) {
                var problems = '<p>' + d.str[0] + '</p>' + '<p>' + d.str[1] + '</p>' + '<p>' + d.str[2] + '</p>' + "<p>Answer: " + d.ans + " Your answer: " + d.input + "</p>"
                return problems
            })
        }else if (type == "venn"){
          var currentContainerHeight = $(mainContainer).height()
          $(mainContainer).css("height", currentContainerHeight).css('overflow', 'scroll')
          scope.select('.readingExQ').html('')
          scope.select('.readingExQ2').html('')
          scope.select('.readingExAns').html('')
          var answers = scope.select('.readingExAns').selectAll('div')  .data(outcome)
              .enter()
              .append('div')
              .attr('class', 'row readingExResults')
              .attr('id', function(d,i){return "result"+i})
              // .style('background-color', function(d) {
              //     return (d.correct) ? "#336B87" : "#763626"
              // })
          answers.append('div').attr('class','readingExQ col-md-6 p-x-0')
          answers.append('div').attr('class','readingExQ2 col-md-6 p-x-0')
          answers.select(function(d,i){
            console.log(d)
            console.log(i)
            print.venn(d,"#result"+i,true,true)
          })



        }
  }

  function print(currentP){
    var readingQuestion = scope.select('.readingExQ').selectAll('p').data([])
    readingQuestion.exit()
        .remove();

    readingQuestion.data(currentP.question)
      .enter()
      .append('p')
      .text(function(d, i) {
          return d
      })
      .transition(tran)
      .style('fill-opacity',1)
  }

  loadProblems(qId.split('-')[0]+'/'+qId.split('-')[1] + '/' + qId.split('-')[2],function(error,data){
    if (error) console.log(error)
    else{
      problemSet = data
      currentPi = 0
      // updateProblemNum(currentPi + 1, problemSet.length)
      currentP = problemSet[currentPi]
      makeOptionBar(currentP.options)
      // wheelTransition(currentP.options)
      print(currentP)
    }
  })



})
