$(function()
{
var interact = require("interact.js")
var makeAlert = require('./mods/alert.js')
var $area = $('.area')
var $l = $('#l')
var $r = $('#r')
var $ans = $('#ans')
var moduleNum = $('#icon').html();
var randomize = require('./mods/randomize.js')
var answers = []
var corrected = []
var $modal = $('.modal')

$('#restart').on("click", function(){
  location.reload();
})
function loadJSON(callback){
        $.getJSON('../json/lesson'+moduleNum + '.json')
        .done(function(data){
        callback(null, data);
     }).fail(function(){body.append('Failed to Load Data')});

    }

loadJSON(function(err, data){
  var terms = []
  var out = []
  for (term in data.ex.concepts.terms){
    answers.push(data.ex.concepts.terms[term])
  }

  answers = randomize.shuffle(answers);

  $ans.text(answers[0][1])
  $ans.attr("value",answers[0][1])

})


function makeResult(){
  html = "<h3> Correct Answer(s)</h1>";
  for (var i = 0;i<corrected.length;i++){
    html += "<p class='def lead'>" + corrected[i][0] +"</p><p>" +corrected[i][1]+ "</p>"
  }
  $('.modal-body').append(html);
}

interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: ".area",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
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
    event.relatedTarget.setAttribute("value",event.target.textContent);
    event.relatedTarget.classList.add("chosen");

    if (event.relatedTarget.textContent == answers[0][0]){
      // console.log(answers)
      $('.chosen').remove();
      // console.log(answers.length)
      if (typeof answers !== 'undefined' && answers.length > 1){
      corrected.push(answers.shift());
      $ans.text(answers[0][1])
      $ans.attr("value",answers[0][1])
      makeAlert($('.jumbotron'), "b", "This is correct! Continue dragging the correct definition to complete this quiz.",2)
    } else{
      jQuery.post("/report", {label: "concepts", moduleNo: moduleNum}, function(res){
        $('.modal-body').append("<p class = 'lead'>You have completed this section! " + res +"</p>") ;
        makeResult();
        $modal.modal('toggle')

           });



    }

      // console.log(answers)

    } else{
      event.target.classList.remove('dropzone');
        $('.modal-body').append("<p class = 'lead'>Opps, that wasn't correct. You have matched the concepts below corrected. Press Restart to try again.</p>" )
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
