//universal variables
try{
  var logged = ($('#mainnavbar').attr('data') == "notLogged") ? false : true;
  var uid = $('#mainnavbar').attr('data')
  var $modal =$('.modal')
  var modal = d3.select('.modal')
} catch(e){
  console.log(e)
}

function modalMsg(head,body){
  cleanModal();
  modal.select('.modal-header').text(head);
  modal.select('.modal-body').html(body)
  $modal.modal('toggle')
}



function alert(msg, color, position,location){

  if (position == undefined) position = "bottom right"
      notifyMsg = msg
      notifyOption = {
          style: color,
          position: position
      }

    if (location) {
      notifyOption.className = "mini";
      $(location).notify(notifyMsg,notifyOption);
    }
    else $.notify(notifyMsg,notifyOption)
    }


var getUid = function(){
  return $('#mainnavbar').attr('data')
}

function recordCompletion(uid,mod,chapter,section){
  var data = {
      uid: uid,
      module: mod,
      chapter: chapter,
      section: section
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

function recordLeader(uid,logicise,score){
  var data = {
      uid: uid,
      logicise: logicise,
      score: score
  }
  $.ajax({
      url: '/data/leader',
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

function sendAttempts(dataSet){


  // console.log(toSend)
  $.ajax({
      url: '/data/attempt',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(dataSet),
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

// <div class="dropdown">
//   <button class="dropbtn">Dropdown</button>
//   <div class="dropdown-content">
//     <a href="#">Link 1</a>
//     <a href="#">Link 2</a>
//     <a href="#">Link 3</a>
//   </div>
// </div>

function makeCategory(eventId,num){
  var modId = eventId.split('-')[0]
  var chapter = eventId.split('-')[1]
  var section =  eventId.split('-')[2]
  var url = eventId.split('-')[0] + '/' + eventId.split('-')[1] + '/' + eventId.split('-')[2]

  var scope = d3.select('#'+eventId)
  var $scope = $('#'+eventId)
  var status = "restart"
  var dropdownSelected = []

        scope.select('#catConfirm').on('click',function(){
          if (status == "restart"){
            loadProblems(url, function(error, data) {
              if (num == null || num >data.problems.length) num = data.problems.length
              // console.log(url)
              data.choices.unshift('Choose here')
                if (error) console.log(error)
                else {
                  console.log(data)
                  status = "answer";
                  data.problems = _.shuffle(data.problems)
                  d3.select('.dropdowns').html('')
                  for (var problem  =0; problem<num;problem++){
                    makeDropdown("cat-"+problem, data.problems[problem].question,data.choices,'.dropdowns')
                    dropdownSelected[problem] = false
                    d3.selectAll('select').on('change',function(){
                      var problemIndex = d3.event.target.id.split('-')[1]
                      if (d3.event.target.value == data.problems[problemIndex].answer) dropdownSelected[problemIndex] = true
                      else  dropdownSelected[problemIndex] = false
                    })
                    mathJax.reload(eventId)
                  }

                }


                })



          } else {
            if (!_.contains(dropdownSelected,false)){
              alert('This is correct! Quiz completed','correctblue')
            }else{
              var count = 0;
              for (var i = 0;i<dropdownSelected.length;i++){
                if (dropdownSelected[i] == false){
                  count += 1;
                }
              }
              status = "restart"
              alert('Unfortunately you have '+count+ " wrong answer(s). Click confirm again to restart.", 'incorred')
            }




      }
  })

}


function makeDropdown(id, text,choices,div){
    var wrapper = d3.select(div).append('div').attr('id',"wrapper"+id)
    wrapper.append('label').attr('class','dropdownQLabel').attr('for','label'+id).text(text)
    var selector = wrapper.append('select').attr('class','dropdownQSelect').attr('id',id)

    selector.selectAll('option')
      .data(choices)
      .enter()
      .append("option")
      .text(function(d){return d})
      .attr('value',function(d){return d})
    return wrapper
}

//TABLES

function tabulate(data, div, op) {
  d3.select(div).select('table').remove()
    var columns = []
    data.forEach(function(i) {
        columns.push(i.name)
    })
    var table = d3.select(div).append("table")


    thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) {
            return column;
        });

    var rows = []

    for (var i = 0; i < data[0].column.length; i++) {
        var content = []
        for (var j = 0; j < columns.length; j++) {
          if (op == "fill"){
            if (data[j].atomic) content.push(data[j].column[i])
            else content.push("")

          }else{
            content.push(data[j].column[i])

          }
        }
        rows.push(content)
    }

    //  create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(rows)
        .enter()
        .append("tr");

    // create a cell in each row for each column

      var cells = rows.selectAll("td")
          .data(function(cell) {
              return cell
          })
          .enter()
          .append("td")
          .html(function(d) {

              return d;
          })
          .attr("class",function(d){
            if (d == "") return "blank"
          })




    return table;
}

var and = "\\wedge"

function makeTruthTable(letters, sentence) {
    var nRows = Math.pow(2, letters.length)
    var output = []
    var k = nRows / 2
    for (l in letters) {
        var col = {}
        col.name = "$" + letters[l] + "$"
        var temp = []
        var current = "T"
        while (temp.length < nRows) {
            for (var i = 0; i < k; i++) {
                temp.push("T")
            }
            for (var i = 0; i < k; i++) {
                temp.push("F")
            }
        }
        col.column = temp
        output.push(col)
        k = k / 2
    }
    var lastCol = []
    for (var i = 0; i < nRows; i++) {
        var val = {}
        for (var j = 0; j < letters.length; j++) {
            val[letters[j]] = (output[j].column[i] == "T") ? true : false;
        }
        // console.log(val)
        // console.log(evaluateSL(val,sentence))
        evaluateSL(val, sentence) ? lastCol.push("T") : lastCol.push("F");

    }
    // console.log(slSentencetoString(sentence))
    output.push({
        "name": "$" + slSentencetoString(sentence) + "$",
        "column": lastCol
    })
    return output;
}

var slSentence = function(l, nl, c, r, nr) {
    if (l == null || r == null) {
        this.atomic = true
    } else this.atomic = false;
    this.left = l,
        this.right = r,
        this.connective = c,
        this.leftnegated = nl,
        this.rightnegated = nr
}

function slSentencetoString(sl) {
    if (sl.atomic) {
        return (sl.leftnegated) ? "\\neg " + sl.left : sl.left
    }
    if (typeof sl.left != "string") var left = slSentencetoString(sl.left)
    else var left = sl.left
    if (typeof sl.right != "string") var right = slSentencetoString(sl.right)
    else var right = sl.right
    if (sl.leftnegated) left = "\\neg " + left;
    if (sl.rightnegated) right = "\\neg " + right;
    return "(" + left + sl.connective + " " + right + ")"

}

// console.log()
function evaluateSL(vals, sl) {
    //  console.log(typeof sl.left  != "string")
    // console.log(vals)
    if (sl.atomic) {
        return (sl.leftnegated) ? !vals[sl.left] : vals[sl.left];
    }
    if (typeof sl.left != "string") var left = evaluateSL(vals, sl.left)
    else var left = vals[sl.left]
    if (typeof sl.right != "string") var right = evaluateSL(vals, sl.right)
    else var right = vals[sl.right]
    if (sl.leftnegated) left = !left;
    if (sl.rightnegated) right = !right;
    //  console.log(true && false)
    //  console.log(left && right)
    if (sl.connective == and) {
        return left && right
    }

}



var mathJax = {
  load: function () {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
  document.getElementsByTagName("head")[0].appendChild(script);
  },
  reload: function(id){
    id = id || "";
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,id]);
  },
  config: function(){
    MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [ ['$','$'], ['\\(','\\)'] ]
    }}
  );
}
}


function loadProblems(option, callback) {
    jQuery.post("/problem/" + option)
        .done(function(data) {
            callback(null, data);
        }).fail(function(f) {
            console.log(f)
        })
};

function cleanModal(){
  var modal = d3.select('.modal')
  modal.select('.modal-body').html("")
}

//DRAG matching
function makeDefMatch(eventId) {
    var modId = eventId.split('-')[0]
    var chapter = eventId.split('-')[1]
    var section =  eventId.split('-')[2]
    var url = eventId.split('-')[0] + '/' + eventId.split('-')[1] + '/' + eventId.split('-')[2]
    var corrected = []
    var incorrected = []
    var scope = d3.select('#'+eventId)
    var qText = scope.select('.dragQ')
    loadProblems(url, function(error, data) {
      console.log(url)
        if (error) console.log(error)
        else {
            problemSet = data

            scope.select('#flyzone').selectAll('div')
                .data(problemSet).enter()
                .append('div').attr('class', 'draggable drag-drop def')
                .attr('value', function(d) {
                    return d.answer
                }).text(function(d) {
                    return d.answer
                })
            problemSet = _.shuffle(problemSet)
            currentProblem = problemSet.shift()
            qText.text(currentProblem.question)

        }
    })



    function makeResult(head) {
        // console.log(corrected)
        // console.log(incorrected)f
        cleanModal();
        modal.select('.modal-header').text(head)
        var corrects = modal.select('.modal-body').append('div')
        corrects.append('h3').text('Correct Match(es)')
        corrects.selectAll('div').data(corrected).enter()
            .append('div').html(function(d) {

                return "<u>" + d.question + "</u></br>You chose: " + d.answer;
            })
        var incorrects = modal.select('.modal-body').append('div')
        incorrects.append('h3').text('Incorrect Match(es)')
        incorrects.selectAll('div').data(incorrected).enter()
            .append('div').html(function(d) {

                return "<u>" + d.question + "</u></br>You chose: " + d.input;
            })
        if (logged) {
            var data = []
            corrected.forEach(function(problem) {
                var datapoint = {
                    uid: uid,
                    pid: problem.pid,
                    type: problem.type,
                    input: problem.answer,
                    correct: true,
                }
                data.push(datapoint)
            })
            incorrected.forEach(function(problem) {
                var datapoint = {
                    uid: uid,
                    pid: problem.pid,
                    type: problem.type,
                    input: problem.input,
                    correct: false,
                }
                data.push(datapoint)
            })
            modal.select('.modal-body').append('button').text('Restart').on('click',function(){
              location.reload();
            })
            sendAttempts(data)

            // $.ajax({
            //     url: '/data/attempt',
            //     type: 'POST',
            //     contentType: 'application/json',
            //     data: JSON.stringify(data),
            //     dataType: 'json',
            //     success: function(res) {
            //         //On ajax success do this
            //
            //         console.log("success message " + res)
            //     }
            // });
        }



        // reloadMathjax()
    }


    interact('.draggable')
        .draggable({
            // enable inertial throwing
            inertia: false,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "#"+eventId,
                endOnly: false,
                elementRect: {
                    top: 0,
                    left: 0,
                    bottom: 1,
                    right: 1
                }
            },
            // enable autoScroll
            autoScroll: true,

            // call this function on every dragmove event
            onmove: dragMoveListener,

        });
    //
    function dragMoveListener(event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
    //
    //   // this is used later in the resizing and gesture demos
    window.dragMoveListener = dragMoveListener;
    // /* The dragging code for '.draggable' from the demo above
    //  * applies to this demo as well so it doesn't have to be repeated. */
    // // enable draggables to be dropped into this
    interact('.dropzone').dropzone({
        // only accept elements matching this CSS selector
        // accept: '.yes-drop',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.30,

        // listen for drop related events:

        ondropactivate: function(event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        },
        ondragenter: function(event) {
            var draggableElement = event.relatedTarget,
                dropzoneElement = event.target;

            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
            // draggableElement.textContent = 'Dragged in';
        },
        ondragleave: function(event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
            // event.relatedTarget.setAttribute("value", "")
            // console.log(event.relatedTarget);
            // event.relatedTarget.textContent = 'Dragged out';
        },
        ondrop: function(event) {
            // event.relatedTarget.setAttribute("value",event.target.textContent);
            event.relatedTarget.classList.add("chosen");
            // console.log($(event.relatedTarget).attr('value') )
            // console.log(index )
            var userInput = $(event.relatedTarget).attr('value');
            if (userInput == currentProblem.answer) {

                $('.chosen').remove();
                // console.log(answers.length)
                corrected.push(currentProblem);
                var msg;
                if (problemSet.length != 0) {
                    currentProblem = problemSet.shift()

                    qText.text(currentProblem.question).attr('data', currentProblem.question)
                    msg = "This is correct! Continue dragging the matching box to complete this quiz."
                    alert(msg, 'correctblue')

                } else {
                    makeResult("You have completed this quiz!");
                    $modal.modal('toggle')
                    recordCompletion(uid,modId,chapter,section)


                }



            } else {
                event.target.classList.remove('dropzone');
                currentProblem.input = userInput
                incorrected.push(currentProblem);
                makeResult("Opps, that wasn't correct. You have matched the following correctly. Press Restart to try again.");
                $modal.modal('toggle')
            }
        },
        ondropdeactivate: function(event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}




//MC

function makeMC(mcProblems,eventID){
  var quizDiv = d3.select("#"+eventID)
  quizDiv.select('.QuizIntro').remove()
  quizDiv.select('.readingExQ').selectAll('div')
          .data(mcProblems).enter(function(d){return d})
          .append('div')
          .attr('id',function(d,i){
            return i+"-"+eventID
          })
          .attr('class',function(d,i){
            return 'offScreen '+eventID+"offScreen"
          })
            .html(function(d){
            var str = ""
            for (q in d.question){
              str+=d.question[q]+"<br>"
            }

            return str
          })


}

function makeMCChoices(choices,eventID){
  // console.log(choices)

  var userInput = d3.select('#'+eventID).select('.readingExAns')
  userInput.selectAll('button').remove()


    userInput.selectAll('button').data(choices).enter()
    .append('button')
    .attr('class','btn btn-block btn-greyish '+eventID+"butt")
    .text(function(d){
      return d.text
    })
    .attr('data',function(d){

      return d.data;
    })

  return d3.selectAll('.'+eventID+"butt")
}



function mcQuiz(eventID,url){
  var toComplete
  var data
  var next = d3.select('.nextbutt')
  var result = []

    jQuery.post(url)
      .done(function(dd){
        data = dd
        toComplete = dd.length
        d3.select('#'+eventID).select('.problemnumdisplay').text(toComplete)
        next.on('click',function(d){
          var state = d3.select(this).attr('data')
          if (state == "intro"||state == "next"){
            d3.select('.currentmc'+eventID).remove();
            toComplete -=0;
            makeMC(data,eventID)
            next.attr('data','answer')
            d3.select('.'+eventID+'offScreen').classed('offScreen',false).classed('currentMC'+eventID,true)
            var current = data.shift()
            // current = current[0]
            var buttData = []
            current.choices.forEach(function(k){
              var obj = {
                text:k,
                data:k
              }
              buttData.push(obj)
            })
            result.push(current)
            var buttons = makeMCChoices(buttData,eventID)
            // console.log(buttons)
            buttons.on('click',function(d){
              result[result.length-1].input = d.data;
              if (d.data == current.answer){
                alert("Correct! Press 'Next' to contniue","correctblue")
                result[result.length-1].correct = true;
              }else{
                alert("Incorrect! Press 'Next' to contniue","incorred")
                result[result.length-1].correct = false;

              }
              toComplete -=1;
              (toComplete != 0)? next.attr('data','next') :next.attr('data','over');
              d3.select('#'+eventID).select('.problemnumdisplay').text(toComplete)
              buttons.classed('invisible',true)

            })
            mathJax.reload(eventID)
          }else if (state == "over"){
            var info = eventID.split('-')
            recordCompletion(uid,info[0],info[1],info[2])
            makeResult(result,eventID)
          }
        })

    }).fail()
  }

function makeResult(problemSet,eventID){
  var quizDiv = d3.select('#'+eventID)

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
         mathJax.reload()
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
