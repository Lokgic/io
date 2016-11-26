$(function()
{
var interact = require("interact.js")
var $area = $('.area')
var $ans = $('#ans')
var moduleNum = $('#icon').html();
var randomize = require('./mods/randomize.js')
var answers = []
// console.log(moduleNum)
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
    terms.push(data.ex.concepts.terms[term][0])
    answers.push(data.ex.concepts.terms[term][1])
    out.push(data.ex.concepts.terms[term][1])
  }
  // terms = randomize.shuffle(terms);
  console.log(answers)
  out = randomize.shuffle(out);
  for (term in terms){
    $area.prepend("<div class = 'draggable drag-drop' id = '" +term +"'>" + terms[term] + "</div>")

  }
  for (term in out){

    $ans.append("<div class = 'dropzone'>" + out[term] + "</div>")
  }

})




interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
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
    event.relatedTarget.setAttribute("value",event.target.textContent)
    // console.log(answers);
    // event.relatedTarget.textContent = 'Dropped';
    // event.target.
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});

$('#butt').on('click',function(){
  console.log(answers)
  for (var i = 0; i<answers.length;i++){
    // console.log($("#"+i).attr("value"))
    if ($("#"+i).attr("value")!= answers[i]){
      return console.log(false);
    }
  }
return console.log(true);
})

})
