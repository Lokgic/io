$(function() {
    var leaderboard = require('./mods/leaderboard.js')
    var makeAlert = require('./mods/alert.js')
    var randomize = require('./mods/randomize.js')
    $leaderboard = $('#leaderboard');
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
    var passing = 100;
    $.getJSON('../json/dukedouche.json')
        .done(function(data) {
            doStuff(data);
        }).fail(function() {
            body.append('Failed to Load Data')
        });

    function doStuff(data) {
        leaderboard.draw("logicland", $leaderboard);
        var id = "instruction";
        var modal = bootstrap.makeModal(id, "?");


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
            $('#footerdd').append(modal[0]);;


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
              score = Math.round(score*10);
              $('#headerdd').text("Result");
              $('#blockdd').html('<p class = "lead">Your score is ' + score + '. </p>');
              var output = "";
              if (score > 50){
      				jQuery.post("../logicland", {score:score}, function(res){
      				    	leaderboard.draw("logicland", $leaderboard);
      				      });
      				}
              leaderboard.draw("logicland", $leaderboard);
      				if (score >= passing){
      				    jQuery.post("../report", {passed: true, label: "reading_1", moduleNo: 3}, function(res){
      				       output += "You passed! "+res;
      				       makeAlert('#carddd', "b",output, 1);
      				      });
        					}else{
                    output += "Unfortunately, you need " +passing + " to pass this assignment. Press Next to restart."
        					 makeAlert('#carddd', "b",output, 4);
        					  leaderboard.draw("logicland", $leaderboard);

        					}

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
          else return -0.05;
        }
          return l-r;
        }



    function makeDropdown(id, q) {


        html = '<div class="form-group" id = form'+   id + ' >';
        html += '<label for="' + id + '">' + q + '</label>';
        html += '<select class="form-control" id="' + id + '">'
        for (var i = 0; i < 11; i++) {
          if (i == 0) var k = i + " Certainly not";
          else if (i == 10 ) var k = i + " Certainly";
          else if (i == 5 ) var k = i + " No evidence to suggest one way or another";
          else k = i;
          html += '<option value = "' + i + '">' + k + '</option>';
        }


        html += '</select></div>';
        return html;
    }







});
