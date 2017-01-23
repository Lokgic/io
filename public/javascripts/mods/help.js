//universal variables
try{
  var logged = ($('#mainnavbar').attr('data') == "notLogged") ? false : true;
  var uid = $('#mainnavbar').attr('data')
  var $modal =$('.modal')
  var modal = d3.select('.modal')
} catch(e){
  console.log(e)
}



function alert(msg, color, location){
  if (location == undefined) location = "bottom right"
      notifyMsg = msg
      notifyOption = {
          style: color,
          position: location
      }

    $.notify(notifyMsg,notifyOption)
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



//TABLES

function tabulate(data, div) {
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
            content.push(data[j].column[i])
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
        .append("td") // sets the font style
        .html(function(d) {
            // console.log(d)
            return d;
        });

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
