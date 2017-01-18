$(function() {

    // var Chance = require('chance')
    // var chance = new Chance();
    var interact = require("interact.js")
    var corrected = []
    var incorrected = []
    var help = require('./mods/helpers.js')
        // var randomize = require('./mods/randomize.js')

    var $modal = $('.modal')
    var mathjax = false;
    var index;
    // var pool = []
    function reloadMathjax(id) {
        id = id || "";
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, id]);
    }



    var quizDiv = d3.select('.dragMatch')
    var qId = quizDiv.attr('id')
    var modal = d3.select('#' + qId + 'modal')
    var qInfo = qId.split('-')
    console.log(qInfo)
    var scope = d3.select('.dragMatch')
    var logged = ($('#mainnavbar').attr('data') == "notLogged") ? false : true;
    var uid = $('#mainnavbar').attr('data')
    var problemSet
    var currentProblem
    var qText;
    $('#restart').on("click", function() {
        location.reload();
    })

    function loadProblems(option, callback) {
        jQuery.post("/problem/" + option)
            .done(function(data) {
                callback(null, data);
            }).fail(function(f) {
                console.log(f)
            })
    };



    loadProblems(qId.split('-')[0] + '/' + qId.split('-')[1] + '/' + qId.split('-')[2], function(error, data) {
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
            qText = d3.select('#dragQ').text(currentProblem.question)

        }
    })







    function makeResult() {
        // console.log(corrected)
        // console.log(incorrected)
        modal.select('.modal-body').html("")
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

            $.ajax({
                url: '/data/attempt',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(res) {
                    //On ajax success do this

                    console.log("success message " + res)
                }
            });
        }



        reloadMathjax()
    }

    interact('.draggable')
        .draggable({
            // enable inertial throwing
            inertia: false,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "#sl-1-def",
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
            // call this function on every dragend event
            // onend: function (event) {
            //     console.log(event)
            //   var textEl = event.target.querySelector('p');
            //   textEl && (textEl.textContent =
            //     'moved a distance of '
            //     + (Math.sqrt(event.dx * event.dx +
            //                  event.dy * event.dy)|0) + 'px');
            // }
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
            event.relatedTarget.setAttribute("value", "")
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
                    help.alert(msg, 'correctblue')
                        // makeAlert($('#dragMatch'), "a", "This is correct! Continue dragging the matching box to complete this quiz.",2)
                } else {
                    $('.modal-header').append("<p class = 'lead'>You have completed this quiz!</p>")
                    makeResult();
                    $modal.modal('toggle')
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

                            console.log("success message " + res)
                        }
                    });

                }



            } else {
                event.target.classList.remove('dropzone');
                $('.modal-header').text("Opps, that wasn't correct. You have matched the following correctly. Press Restart to try again.")
                currentProblem.input = userInput
                incorrected.push(currentProblem);
                makeResult();
                $modal.modal('toggle')
            }
        },
        ondropdeactivate: function(event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });



})
