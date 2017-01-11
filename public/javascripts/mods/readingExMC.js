var venn = require("venn.js")
var readingExMC = function readingExMC(problemSet,mainContainer,type) {

    var print = {
      "text":function(currentP){
        var readingQuestion = scope.select('.readingExQ').selectAll('p').data([])
        readingQuestion.exit()
            .remove();

        readingQuestion.data(currentP.str)
            .enter()
            .append('p')
            .text(function(d, i) {
                return d
            })
            .transition(tran)
            .style('fill-opacity',1)
      },
      "venn":function(currentP, location,answer,result){
        if (location == undefined) location = mainContainer
        var vennDiv = " .readingExQ2"
        var textDiv = " .readingExQ"
        var readingQuestion = d3.select(location).select(textDiv).selectAll('p').data([])
        readingQuestion.exit()
            .remove();

        readingQuestion.data(currentP.str)
            .enter()
            .append('p')
            .text(function(d, i) {
                return d
            })
            .transition(tran)
            .style('fill-opacity',1)

          if (answer){
            d3.select(location).select(textDiv).append('p').text("Answer: "+ currentP.ans)
          }

          if (result){
            d3.select(location).select(textDiv).append('p').text( "Your choice: "+ currentP.input)
            .attr('class',function(){
              if (currentP.correct) return "resultCorrect"
              else if (!currentP.correct) return "resultIncorrect"
            })

          }

        d3.select(location).select(vennDiv).html("")
         drawVenn(location  + vennDiv, currentP)

      }
    }

    function drawVenn(location, currentP){
      var readingChart = venn.VennDiagram()
      var set = [
        {sets:[currentP.s], size: 3},
        {sets:[currentP.p], size: 3},
        {sets:[currentP.s,currentP.p], size: 1}
      ]


      var readingVenn = d3.select(location).datum(set)
      .call(readingChart)
      readingVenn.selectAll('path').style("fill", "white")
          .style('fill-opacity',0)
          .style('stroke', "black")
          .style('stroke-opacity',1)
          .style('stroke-width',3)
      var target = currentP.diagram+"D"
      var targetMood = currentP[currentP.diagram+"mood"]
      if (targetMood == "E"){

        var toShade = 'g[data-venn-sets="'+ currentP[currentP.diagram+"D"]+ '"]'

        readingVenn.select(toShade).select('path').style('fill','#999').style('fill-opacity',1)


          toShade = 'g[data-venn-sets="'+ currentP.s +'"]'
          console.log(toShade)
           readingVenn.select(toShade).select('path').style('fill','white').style('fill-opacity',1)

      } else if (targetMood == "A"){
        var toShade = 'g[data-venn-sets="'+ currentP[currentP.diagram+"D"]+ '"]'

        readingVenn.select(toShade).select('path').style('fill','#999').style('fill-opacity',1)

          toShade = 'g[data-venn-sets="'+ currentP.s+"_"+ currentP.p+'"]'
          console.log(toShade)
           readingVenn.select(toShade).select('path').style('fill','white').style('fill-opacity',1)
      } else if (targetMood == "I"){
        var h = $(location).height()
        var w = $(location).width()
        // console.log(h)
        d3.select(location).select('svg').append('text').text('X').attr('dx',w/2).attr('dy',h/2).style('fill','black').style('font-size','2.5em')
      }  else if (targetMood == "O"){
        var h = $(location).height()
        var w = $(location).width()/2.5
        // console.log(h)
        d3.select(location).select('svg').append('text').text('X').attr('dx',w/2).attr('dy',h/2).style('fill','black').style('font-size','2.5em')
      }
    }

    if (type == undefined) type = "text"

    var scope = d3.select(mainContainer)
    console.log(scope)
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

    var ansSVG = scope.select('.readingExAns')
        .append('svg')
        .attr('width', ansW)
        .attr('height', ansH)
        .append('g')
        .attr('transform', 'translate(' + (ansW / 2) + ',' + (ansH / 2) + ')');
    var ansRadius = Math.min(ansH, ansW) / 4;
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



    // readingQ = scope.select('.readingExQ')
    currentPi = 0
    updateProblemNum(currentPi + 1, problemSet.length)
    currentP = problemSet[currentPi]
    wheelTransition(currentP.choices)
    print[type](currentP)
    // wheelTransition(currentP.choices)
        // console.log(currentP)
    // readingQ.selectAll("p")
    //     .data(currentP.str)
    //     .enter()
    //     .append('p')
    //     .text(function(d, i) {
    //         return d
    //     })




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
                over = (problemSet.length == currentPi + 1)
                notifyMsg = (!over) ? 'Answer recorded. Press "Next" to continue. Result will be shown at the end.' : "Exercise completed. Press 'Next' to see the result"
                var notifyOption = (!over) ? {
                    style: 'info',
                    position: "botton right"
                } : {
                    style: "correctblue",
                    position: "bottom right"
                }
                outcome[currentPi] = currentP
                outcome[currentPi].correct = (chosenAnswer == currentP.ans) ? true : false
                outcome[currentPi].input = chosenAnswer
                buttStatus = (problemSet.length == currentPi + 1) ? "result" : "next"
                chosenAnswer = undefined
                readingConfirmButt.style('color', "grey")
                readingNextButt.style('color', "white")
                buttStatus = (over) ? "result" : "next";
            }
            $.notify(notifyMsg, notifyOption);
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

            wheelTransition(currentP.choices)
            print[type](currentP)
        } else if (buttStatus == "result") {
            createResult(outcome)
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






}





module.exports = readingExMC
