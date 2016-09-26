(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var makeAlert = function(location, direction, text, code){ //direction: a= above, b=below
  /////This takes care of the HTML
  var tag;
  if (code == 0){
	if (direction == "a"&& $(location).prev().hasClass("alert")){
          $(location).prev().remove();
        }
      if (direction == "b" && $(location).next().hasClass("alert")){
          $(location).next().remove();
        }
  }
  else if (code == 1){tag = "alert-success";}
  else if (code == 2){tag = "alert-info";}
  else if (code == 3){tag = "alert-warning"}
  else{tag = "alert-danger"}
  var html = "<div class='alert " + tag +  " alert-dismissible fade in m-x-1' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+text+"</div>";

  if (direction == "a"){
    if ($(location).prev().hasClass("alert")) {
      $(location).prev().remove();
    }
    $(location).before(html);
    }

  if (direction == "b"){
    if ($(location).next().hasClass("alert")) {
      $(location).next().remove();
    }
    $(location).after(html);
    }

  }

 module.exports = makeAlert;
},{}],2:[function(require,module,exports){
var makeCard = function makeCard(id) {
    html = '<div class="card" id = "card'+id + '"><div class="card-header" id = header' + id + '></div>'
    html += '<div class="card-block" id = "block' + id + '"></div>'
    html += '<div class= "card-footer" id = footer' + id + '></div>'
    html += '</div>'

    return html;
}


var makeModal = function makeModal(id) {

    var button = '<button class="btn btn-primary" data-toggle="modal" data-target=".modalcontainer' + id + '" id = modalbutton' + id + '>Modal</button>';



    var content = '<div class="modal fade modalcontainer' + id + '" tabindex="-1" role="dialog" aria-labelledby="modalheader' + id + '" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content" id = "modalcontent' + id + '"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="modaltitle' + id + '">Modal title</h4></div><div class ="modal-body" id = "modalmain' + id + '"</div></div></div></div>';
    return [button, content];

}


module.exports = {
    makeCard: makeCard,
    makeModal: makeModal
};

},{}],3:[function(require,module,exports){
var randomize = {
  oneNumber: function(n){
     return Math.floor(Math.random()* n) + 1
  },
  drawOneRandomFromSet: function(set) {
        return  set[Math.floor(Math.random()* set.length)];
        },

  shuffle: function(arr) {
    var currentI = arr.length, tempValue, randomI;

    while (0!== currentI){
      randomI = Math.floor(Math.random() * currentI);
          currentI -= 1;

          tempValue = arr[currentI];
          arr[currentI] = arr[randomI];
          arr[randomI] = tempValue;
        }

        return arr;
      },
    chooceProbabilistically: function(set, probability){

    var n = Math.random();
    var low = 0;
    var outcome;
    for (var i = 0; i<set.length;i++){
      if (low<n&&n<probability[i]){
        low = probability[i];
        outcome = set[i];
      }
    }
      return outcome;
    },

    sample: function(set, n){
    	var newSet = randomize.shuffle(set);
    	var output =[];
    	for (var i= 0; i<n; i++){
    		output.push(newSet.pop());
    	}
    	return output;
    }

  }

module.exports = randomize;

},{}],4:[function(require,module,exports){
$(function() {

    var makeAlert = require('./mods/alert.js')
    var randomize = require('./mods/randomize.js')
    var bootstrap = require('./mods/bootstrap.js')
    var $left = $('#left');
    var currentQuestion;
    var next = false;
    var buttonHTML = '<button type="button" id = "submit" class="btn btn-primary" >Submit</button>';
    var nextHTML = '<button type="button" id = "next" class="btn btn-primary" disabled  >Next</button>';
    var $next = $('#next');
    var $submit = $('#submit');
    var score = 0;
    var finished = false;
    $.getJSON('../json/dukedouche.json')
        .done(function(data) {
            doStuff(data);
        }).fail(function() {
            body.append('Failed to Load Data')
        });

    function doStuff(data) {

        var id = "instruction";
        var modal = bootstrap.makeModal(id);

        $left.append(modal[0]);;
        $('body').append(modal[1]);
        $('#modaltitle' + id).text("Logicland: Instruction");
        for (section in data.setup) {
            $('#modalmain' + id).append('<h4>' + section + '</h4>');
            $('#modalmain' + id).append('<p class = "lead">' + data.setup[section] + '</p>');
        }
        $('.modalcontainer' + id).modal('show');


        var questions = data.problems;
        $left.html(bootstrap.makeCard("dd"));
        randomize.shuffle(questions);


        currentQuestion = questions.pop();
        var index = 1;
        var ans;
        ask(currentQuestion);



        function ask(q) {
            makeAlert('#carddd',"b", "Choose the number that best represents your estimate, and then press Next to continue",3);
            $('#headerdd').html('<h4> Encounter ' + index + '</h4>');
            $('#blockdd').text(q.setup);
            if (q.question.length == 1) ans = q.question[0][1];
            else {
              ans = []
              for (problem in q.question){
                ans.push(q.question[problem][1]);
              }
            }
            $('#footerdd').html("");
            for (n in q.question) {
                $('#footerdd').append(makeDropdown(n, q.question[n][0]));
            }
            $('#footerdd').append(buttonHTML);
            $('#footerdd').append(nextHTML);


            activateSubmit(q);

        }


            function activateSubmit(q){

              $('#submit').on('click', function(){
                $('#submit').attr("disabled", true);
                $('#next').attr("disabled", false);
                 activateNext(q);
                if (q.question.length == 1){
                  var choice = $('#0 option:selected').val();
                  score += scoringRule(parseInt(q.question[0][1]),parseInt(choice));
                } else{
                  var result = 0;
                  for (var i = 0; i<q.question.length;i++){
                    result += scoringRule(q.question[i][1],parseInt($('#' + i + ' option:selected').val()));

                  }
                  score += result;


                }
                console.log(score);
              })


            }

            function activateNext(){
              makeAlert('#carddd',"b", "Your answer has been recorded. Your total score will be shown at the end",2);
              $('#next').on('click', function (){
              if (questions.length !=0){
              currentQuestion = questions.pop();
              index += 1;
              ask(currentQuestion);
              $('#submit').attr("disabled", false);
              $('#next').attr("disabled", true)
            } else{
              if(finished == false) {
                finished = true;
                ending();
              } else{
                location.reload();
              }
            }

            })
            }

            function ending(){
              $('#headerdd').text("Result");
              $('#blockdd').html('<p class = "lead">Your score is ' + (score*10) + '. </p>');
              makeAlert('#carddd',"b", "Click next to restart",3);
            }




    }

    function scoringRule(ans, choice){
      ans = ans/10;
      choice = choice/10;
      // console.log(ans + " " + choice);
        var r = Math.pow(choice,2) + Math.pow(1 - choice,2);
        // console.log(r);
        if (ans == 1){
          var l = 2*choice;
        } else if (ans == 0){
            var l = 2*(1-choice);
        }
        else if (ans == 0.5){
          if (choice == 0.5) return 1;
          else return 0;
        }
          return l-r;
        }



    function makeDropdown(id, q) {


        html = '<div class="form-group" id = form+'
        id + ' >';
        html += '<label for="' + id + '">' + q + '</label>';
        html += '<select class="form-control" id="' + id + '">'
        for (var i = 0; i < 11; i++) {
          if (i == 0) var k = i + " Certainly not"
          else if (i == 10 ) var k = i + " Certainly"
          else if (i == 5 ) var k = i + " No evidence to suggest one way or another"
          else k = i;
          html += '<option value = "' + i + '">' + k + '</option>';
        }


        html += '</select></div>';
        return html;
    }







});

},{"./mods/alert.js":1,"./mods/bootstrap.js":2,"./mods/randomize.js":3}]},{},[4]);
