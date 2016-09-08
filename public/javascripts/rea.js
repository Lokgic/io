var makeAlert = require('./mods/alert.js')
var randomize = require('./mods/randomize.js')
var mathJax = require('./mods/mathjax.js')
var makeCard = {};
makeCard["fill"] = require('./mods/makefillcard.js')
makeCard["dropdown"] = require('./mods/makedropdowncard.js')
makeCard["game"] = require('./mods/makegamecard.js')


// global var
var moduleNo = $("title").attr('id');
var conceptsReset = false;

$(function() {
  init("reading");
})




//generate concepts quizzing cards. n is the index of the solution in AllDfs, which includes just terms, but indexes preversexd. q is the question term. return htmlxxxxxx


//check multiple answer on one page, works for concepts



//clear all color and reset the button


  // run at this beginning of page, uses new alertmaker
function instruction(type){

  if (type == "reading"){
    var location = $('#readingcard');
  makeAlert(location, "b",'Finish the reading quizzes below in order to complete this module. Once you are finished, press the submit button for grading. Make sure you are logged in to get credit. They are infinitely repeatable, and there is no penalty for failing.', 3);
  } else if (type == "concepts"){
    var location = $('#conceptscard');
    makeAlert(location, 'b', 'Define the terms given below. Once you are finished, press the submit button for grading. Make sure you are logged in to get credit. They are infinitely repeatable, and there is no penalty for failing.',3);
  }
}






//method agnostic - if drop down it jus goes add selected tag to find picked item.
function checkReadingAnswer(obj){
  var selectorTag;
  if (obj.method == "dropdown") selectorTag = " option:selected";
  else if (obj.method == "fill") selectorTag = "";
  var correct =[];
  for (var i = 0; i < obj.questions.length;i++){
    var $targetLabel = $("#" +obj.id + i +"label");
    var $targetInput = $("#" + obj.id + i+ selectorTag);
    if ($targetInput.val().toLowerCase().trim() == obj.questions[i][1].toLowerCase().trim()){
      correct.push(i);
      $targetLabel.html(obj.questions[i][0] + " &#10004;");
    } else $targetLabel.html(obj.questions[i][0] + " &#10008;");
  }
  if (correct.length == obj.questions.length) return true;
    else return false;
}



      
//used load json, embed the quiz initiation in the callback
    function loadJSON(type, callback){
        $.getJSON('../json/' + type + moduleNo +'.json') 
        .done(function(data){
        callback(null, data);
     }).fail(function(){console.log('Failed to Load Quiz')});
      


    }
//create button that track the problem. needed to have multiple buttons
function monitorButton(problemObject){
      $('#' + problemObject.id + 'submit').on('click', function(e){
        if (checkReadingAnswer(problemObject)){
            jQuery.post("/report", {label: problemObject.label, moduleNo: problemObject.moduleNo}, function(res){
                    makeAlert($('#' + problemObject.id + 'submit'), "a", "You have completed this section! " + res,2);
                 });
        }else {
                  makeAlert(this, "a", "Incorrect answers are marked by &#10008;. Fix them and press this button to submit again.",4)
                   
                }
        mathJax.reload(problemObject.id + "card"); 
        })
}

function makeTable(x,y, id){
  var tableHTML = '<table class="table truthtable"><tbody>';
  for (var i=0;i<x;i++){
    tableHTML += '<tr>';
    for (var j = 0; j<y; j++){
      tableHTML += '<td id=x'+i + 'y' +j +id+'></td>';
    }
    tableHTML+= "</tr>"
  }
  tableHTML+='</tbody></table>'
  return tableHTML;
}

function fillTable(type, id){
  $('#x0y0'+id).html('A');
  $('#x0y1'+id).html('B');
  symbol = {};
  symbol.conditional = '\\to';
  symbol.disjunction = '\\vee';
  symbol.conjunction =  '\\wedge';
  symbol.biconditional = '\\leftrightarrow';
   $('#x0y2'+id).html('??');
  var atomic = [['T', 'T'],
                ['T', 'F'],
                ['F', 'T'],
                ['F', 'F']
                      ];
  truthValues = {};
  truthValues.conditional = ['T','F','T','T'];
  truthValues.conjunction = ['T','F','F','F'];
  truthValues.disjunction = ['T','T', 'T', 'F'];
  truthValues.biconditional = ['T', 'F', 'F', 'T'];



    for (var x = 0; x<  atomic.length;x++){
      for (var y = 0; y<  atomic[0].length; y++ ){
        $('#x'+(x+1) +'y'+y+id).html(atomic[x][y]);
      }
    }

  for (var x = 0; x <truthValues[type].length;x++){
    $('#x'+(x+1) +'y2'+id).html(truthValues[type][x])
  }
}

function truthTableInterpretation(type){
    score = 0;
  var tableId = "truthTable";
  var $panel = $('#' + type);
  var connectives = ['conditional','disjunction','conjunction','biconditional'];
  var connectivesP = [0.4,0.6,.8,1];
  var cardHTML = '<div class="card" id ="truthTableInterpretationCard"><h1 class="card-header display-4">Truth Table Interpretation</h1><div class="p-x-2 card-block" id = "truthTableInterpretationBlock"></div></div>';
 
  $panel.append(cardHTML);
  var choose = randomize.chooceProbabilistically(connectives, connectivesP);
  function setupProblem(){
    $('#truthTableInterpretationBlock').html(makeTable(5,3,tableId));
    fillTable(choose, tableId);
    var buttonHTML = '<div class="btn-group" role="group" aria-label="TruthTableAnswer">';
    buttonHTML +='<button type="button" class="btn btn-secondary TTbutton" value = "conditional"> \\(A \\to B \\)</button>';
    buttonHTML +='<button type="button" class="btn btn-secondary TTbutton" value = "disjunction"> \\(A \\vee B \\)</button>';
    buttonHTML +='<button type="button" class="btn btn-secondary TTbutton" value = "conjunction"> \\(A \\wedge B \\)</button>';
    buttonHTML +='<button type="button" class="btn btn-secondary TTbutton" value = "biconditional"> \\(A \\leftrightarrow B \\)</button>';
    buttonHTML += '</div>';
    $('#truthTableInterpretationBlock').append(buttonHTML);
    mathJax.reload("truthTableInterpretationBlock");
    }
   setupProblem();
  $('.TTbutton').on('click', function(e){
    var answer = $(e.currentTarget).val();
    if (answer == choose){
      score+=1;
      console.log(score);
    } else{
      console.log("you suck")
    }
    choose = randomize.chooceProbabilistically(connectives, connectivesP);
    setupProblem();
  })
}



function init(type){
  //html elements are attached according to the type of quiz
  var $alertdiv = $('#' + type  + 'alertdiv');
  var $alert = $('.' + type  + 'alert');
	var $panel = $('#' + type);
	var $card = $('#' + type  + 'card');
	var $header =$('#' + type  + 'header');
	var $block = $('#' + type  + 'block');
	var score;
	var $submit = $("#" +type + "submit");
  

    //loadJSON rest of method exists within
      loadJSON(type, function(err, data){
        instruction(type);

        

        if(type =="reading"){
  
           for (problem in data){

              $panel.append(makeCard[data[problem].method](data[problem]));
              if (data[problem].method != 'game') monitorButton(data[problem]);  

              mathJax.reload(data[problem].id + "card");       
           }
        }





      })
   

   

}