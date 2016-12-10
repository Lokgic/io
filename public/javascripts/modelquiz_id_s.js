$(function() {

    var debug = true;
    var datapoint = {}
    //////Modules
    var _ = require('underscore')
    var makeAlert = require('./mods/alert.js')
    var mathjax = require('./mods/mathjax.js')
    mathjax.reload();


    var newDifficulty = false;
//Module specific settings
    var diff = 0;

    //States initialization
    var score = 0;
    var error = 0;
    var errorAllowed = 2;
    var toPass = 15;
    var buttNextState = "checkAnswer";
    var currentAnswers

    function loadModel(callback){
      jQuery.post("../processing/model_id",{diff:diff})
      .done(function(data){
        datapoint.model = data.model;
        datapoint.problems = []
        datapoint.answers = []
        for (st in data.statements){
          datapoint.problems.push(data.statements[st][0])
          datapoint.answers.push(data.statements[st][1])
        }
          callback(null, data);
      }).fail(function(){$body.append('Failed to Load Quiz')})
    };

    loadModel(function(err, data){


      currentAnswers = initTable(data)


    })

    function initTable(data) {


            $('#ud0').text('{' + data.model.ud + '}')


            html = "";
            for (p in data.model.extensions) {
                html += data.model.extensions[p].string
            }

            $('#ext0').html(html)
            htmlr =""
            for (r in data.model.referents){
              htmlr +="<p>"+ data.model.referents[r].name + ": " + data.model.referents[r].referent + "</p>"
            }
            // console.log(htmlr)
            $('#ref0').html(htmlr)



          var toReturn = []
        for (var i = 0; i<data.statements.length;i++){
          toReturn.push(data.statements[i][1] +"")
          $('#statement'+i).text("\\(" + data.statements[i][0].string +"\\)");
        }
        // console.log(props)

        mathjax.reload("table");

        // console.log(toReturn)

        return toReturn;


    }






    function getTableValues(ans) {

        var last = $('.tbutt').last().attr("id").split("-")[0];

        var truthValues = [];
        j =0
        for (var i = 0; i <= last; i++) {

            var temp
                temp = $("#" + i + "-" + j).attr("value")
                $("#" + i + "-" + j).removeClass("true");
                $("#" + i + "-" + j).removeClass("false");
                if (temp == (ans[i] +"")) toAdd = 'correct'
                else if (temp == undefined || temp == "") toAdd = 'missing'
                else toAdd = 'wrong'
                $("#" + i + "-" + j).addClass(toAdd)
            truthValues[i] = temp;
        }
        if (debug){
          console.log("input: ");
          console.log(truthValues)
          console.log("answer is ")
          console.log(ans)
          console.log("returning " + _.isEqual(truthValues,ans))
        }

        datapoint.result = []
        for (v in truthValues){
          datapoint.result.push(_.isEqual(truthValues[v],ans[v]))
        }

        sendDataPoint();
        return _.isEqual(truthValues,ans);



    }


    function resetTable(){
      makeAlert($('.jumbotron'), "b","",0)
      var last = $('.tbutt').last().attr("id").split("-");

      for (var i = 0; i <= last[0]; i++) {
          for (var j = 0; j <= last[1]; j++) {
              $temp = $("#" + i + "-" + j)
              $temp.attr('value',"")
              $temp.removeClass("correct");
              $temp.removeClass("wrong");
              $temp.removeClass("missing");
              $temp.text("?")
          }
      }

    }

    function updateScore(){

      if (newDifficulty) {
        diff += 1;;
        newDifficulty = false
      }

      $('#description').text("Difficulty Level: " + diff);
      $('#score').text("Score: " + score);
      $('#secondchance').text("Chance(s) Left: "+ " " + (errorAllowed - error))
    }

    $('.tbutt').on('click', function() {
      if (buttNextState == 'checkAnswer'){
        if ($(this).text() == "T") {
          $(this).text("F")
          $(this).attr("value", false)
          $(this).addClass("false")
          $(this).removeClass("true")
        } else {
          $(this).text("T")
          $(this).attr("value", true)
          $(this).addClass("true")
          $(this).removeClass("false")
        }
      }
    })






  updateScore();
    // var currentAnswers = initTable();
    // console.log(currentAnswers)
    $('button').on('click', function(){

        switch (buttNextState){
        case "checkAnswer":{
          if(getTableValues(currentAnswers)){
            switch (score){
              case (toPass - 1):{
                score += 1;
                buttNextState = "startover";
                jQuery.post("/report", {moduleNo: $('title').attr('value'), label : "quiz"}, function(res){
                makeAlert($('.jumbotron'), "b", "You have passed this quiz! " + res ,1)

              });

                break;
              }
              default:  {
                score += 1;
                if (score == 10 || score == 5) newDifficulty = true;
                buttNextState = "newTable"
                makeAlert($('.jumbotron'), "b", "This is correct! You need to solve " + (toPass - score) + " more table(s) to pass this quiz." ,2)
              }
            }
          } else{
            switch(error){
              case (errorAllowed):{
                buttNextState = "startover"
                makeAlert($('.jumbotron'), "b", "Unfortunately this isn't quite right! You have reached the maximum number of errors allowed. Press Submit to try again." ,4)
                break;
              }
              default: {
                error += 1
                buttNextState = "newTable"
                makeAlert($('.jumbotron'), "b", "Unfortunately this isn't quite right! You have " + (errorAllowed - error) + " chance(s) left before having to restart. Incorrect answers are marked red." ,4)
              }

            }


          }
          break;
        }
        case "newTable":{
          resetTable()
          loadModel(function(err, data){

            currentAnswers = initTable(data)


          })

              // console.log(currentAnswers)
          buttNextState ="checkAnswer"
          break;
        }
        case "startover":{
          score = 0;
          error = 0
          resetTable()
          loadModel(function(err, data){

            currentAnswers = initTable(data)


          })
              // console.log(currentAnswers)
          buttNextState ="checkAnswer"
          break;
        }
      }
      updateScore();


    });

    function sendDataPoint(){
      tosend =  {moduleNo: $('title').attr('value'), label : "quiz", datapoint: datapoint}



      $.ajax({
          url: '/data',
          type: 'POST',
          contentType: 'application/json',
          data:JSON.stringify(tosend)
    })
    }



})
