var randomize = require('./randomize.js')
var makeAlert = require('./alert.js')
//generate concepts quizzing cards. n is the index of the solution in AllDfs, which includes just terms, but indexes preversed. q is the question term. return html

var ConceptsQuiz =function makeConceptsQuiz(n, q, allDfs){
  var html = '<div class="card" id = conceptsQCard'+ n + '><h1 class="card-header display-4">' + q.term +  '</h1><div class="card-block qcard">';


  html += '<div class="btn-group-vertical definitions" data-toggle="buttons">'; 
 var answers = [];
 answers.push(q.df);  //makes 5 answer. push the right answer first
 while (answers.length<5){ //add 4 other random answers from allDfs
     var temp = allDfs[Math.floor(Math.random()* allDfs.length)];
     var contained = false;
     for (var i = 0; i < answers.length; i++){
      if (temp === answers[i]) contained = true;
     }
     if (!contained){
      answers.push(temp);
     }
 }

   randomize.shuffle(answers); //mix'em up

    //make buttons
  for (var i = 0; i < answers.length; i++){
     html += '<label class="btn btn-outline-primary btn-sm definition"><input type="radio" name="options" id="option1" autocomplete="off" value ="' + answers[i] +'">' + answers[i] + "</label>"
    }
    html += '</div>'
    return html;
  }

var checkConceptsAnswers = function checkConceptsAnswers(quiz){
  var $submit = $('#conceptssubmit');
  var type = "concepts";
  score = 0;
  for (var i = 0; i<quiz.length;i++){
    var currentQCard = "#conceptsQCard"+(i);
    var chosen = $("label.btn.active", currentQCard).children().val();
    if (chosen === quiz[i].df){
      $(currentQCard).addClass('card-success');
      score++;
    } else{
      $(currentQCard).addClass('card-danger');
    }
  }
  if (score != quiz.length){
    $submit.html("Reset quiz");
    $submit.removeClass('btn-primary');
    $submit.addClass('btn-warning')
    
    makeAlert($('#conceptscard'),'b' , "You got " + score +" out of "+ quiz.length + ". Press 'Reset' to retry", 4);
    conceptsReset = true;
  } else{
    $submit.html("Success!");
    $submit.removeClass('btn-primary');
    $submit.addClass('btn-success')
    $submit.attr("disabled", true);
    jQuery.post("/report", {passed: true, label: type, moduleNo: moduleNo}, function(res){

       makeAlert($('#conceptscard'),'b' , res, 1);
      });
  }
}

var resetConceptsQuiz = function resetConceptsQuiz(n){
  var $submit = $('#conceptssubmit');
  var type = "concepts";
    conceptsReset = false;
    instruction("concepts");
    $submit.addClass('btn-primary');
    $submit.removeClass('btn-warning')
    $submit.html("Submit for Grading");
    // $alert.html("");
    for (var i = 0; i<n;i++){
      var $target = $("#"+type +"QCard"+i);
      $target.removeClass("card-danger");
      $target.removeClass("card-success")
    }
  }




var all = {
  ConceptsQuiz: ConceptsQuiz,
  checkConceptsAnswers: checkConceptsAnswers,
  resetConceptsQuiz: resetConceptsQuiz
}

module.exports = all;