$(function()
{

var Chance = require('chance')
var chance = new Chance();
var interact = require("interact.js")


// var randomize = require('./mods/randomize.js')

var $modal = $('.modal')
var mathjax = false;
var index;
var pool = []
function reloadMathjax(id){
    id = id || "";
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,id]);
  }

var quizDiv = d3.select('.dragMatch')
var qId = quizDiv.attr('id')
var scope = d3.select('.dragMatch')
var logged = ($('#mainnavbar').attr('data') == "notLogged")? false :true;
var sid = $('#mainnavbar').attr('data')
var problemSet
var currentProblem
var qText;
$('#restart').on("click", function(){
  location.reload();
})

function loadProblems(option,callback){
  jQuery.post("/problem/"+option)
  .done(function(data){
      callback(null, data);
  }).fail(function(f){console.log(f)})
};



loadProblems(qId.split('-')[0]+'/'+qId.split('-')[1] + '/' + qId.split('-')[2],function(error,data){
  if (error) console.log(error)
  else{
    problemSet = data

    scope.select('#flyzone').selectAll('div')
          .data(problemSet).enter()
          .append('div').attr('class','draggable drag-drop def')
          .attr('value',function(d){
            return d.answer
          }).text(function(d){
            return d.answer
          })
    currentProblem = problemSet.shift()
    qText = d3.select('#dragQ').text(currentProblem.question)

  }
})







function makeResult(){
  // console.log($('.modal-body'))
  html = "<h3> Correct Answer(s)</h1>";
  for (var i = 0;i<corrected.length;i++){
    html += "<p class='def lead'>" + corrected[i][0] +"</p><p>" +corrected[i][1]+ "</p>"
  }
  $('.modal-body').append(html);
  reloadMathjax()
}

interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: ".dragMatch",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
        console.log(event)
      var textEl = event.target.querySelector('p');
      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  });

  function dragMoveListener (event) {
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

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;
/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */
// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  // accept: '.yes-drop',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.30,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
    // draggableElement.textContent = 'Dragged in';
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    event.relatedTarget.setAttribute("value","")
    // console.log(event.relatedTarget);
    // event.relatedTarget.textContent = 'Dragged out';
  },
  ondrop: function (event) {
    // event.relatedTarget.setAttribute("value",event.target.textContent);
    event.relatedTarget.classList.add("chosen");
    // console.log($(event.relatedTarget).attr('value') )
    // console.log(index )
    if ($(event.relatedTarget).attr('value') == currentProblem.answer){
      console.log(answers)
      $('.chosen').remove();
      // console.log(answers.length)
      corrected.push(currentProblem);
      if (problemSet.length != 0){
      currentProblem = problemSet.shift()
      q.text(currentProblem.question).attr('data',currentProblem.question)
      // makeAlert($('#dragMatch'), "a", "This is correct! Continue dragging the matching box to complete this quiz.",2)
    } else{
      jQuery.post("/report", {label: quizId, moduleNo: moduleNum}, function(res){
        $('.modal-body').append("<p class = 'lead'>You have completed this section! " + res +"</p>") ;
        makeResult();
        $modal.modal('toggle')

           });



    }

      // console.log(answers)

    } else{
      event.target.classList.remove('dropzone');
        $('.modal-body').append("<p class = 'lead'>Opps, that wasn't correct. You have matched the following correctly. Press Restart to try again.</p>" )
      makeResult();
      $modal.modal('toggle')
    }
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});



})
