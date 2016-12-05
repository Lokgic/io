$(function(){
  var Chance = require('chance')
  var makeAlert = require('./mods/alert.js')
  var chance = new Chance();
  var _ = require('underscore')
  var $container = $('#proofFill')
  var moduleNum = $('#icon').html();
  var quizId = $('#proofFill').attr("value")
  var quizType = quizId[0]
  var quizSection = quizId[1]
  // console.log(quizType + " " + quizSection)
  var answerPre = '  <div class="form-group just"><label></label><select class="form-control answers">'
var answerPost = '    </select></div>'

  function getAns(n){
    out = []
    for (var i = 1; i <= n; i++){
      out.push($('#' + i).children('.just').children('.answers').val())
        // console.log($('#' + i).children('.just').children('.answers').val())
    }
    // console.log($('#' + i).children('.just').children('.answers').val())
    return out;
  }
  function loadJSON(callback){
          $.getJSON('../json/lesson'+moduleNum + '.json')
          .done(function(data){
          callback(null, data);
       }).fail(function(){body.append('Failed to Load Data')});

      }



    loadJSON(function(err, data){
      options = "<option>?</option>"


      // console.log(data.ex[quizId].lines)
      lines = data.ex[quizId].lines
      ans = []
      for (line in lines){
        ans.push(lines[line][2])
      }

      ansShuffled = chance.shuffle(_.uniq(ans))
      for (a in ansShuffled){
        options += "<option>" + ansShuffled[a] + "</option>"
      }
      checkbox = answerPre + options + answerPost
      $container.append("<div id = 'scope1' class = 'scope'></div")
      var currentScope = 1
      for (line in lines){
        n = parseInt(line) + 1
        text = (n) +". " + lines[line][1] + checkbox
        if (lines[line][0] == currentScope + 1){
          newScope = 1 + currentScope;
          $('#scope' + currentScope).append("<div id = scope" + newScope + " class = 'scope'></div")
          currentScope = newScope;
        } else if (lines[line][0] == currentScope - 1) currentScope -= 1;

          if (lines[line][3] == true) prefix = "<div class = ass " + "id = " + n +">"
          else prefix = "<div class = line " + "id = " + n +">"
          $('#scope' + currentScope).append(prefix + text + "</div>")

      }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,'proofFill'])
        $('#proofbutt'+quizId).on('click', function(){
          check = getAns(ans.length)
          if(_.isEqual(check,ans)){
            jQuery.post("/report", {label: quizId, moduleNo: moduleNum}, function(res){
              makeAlert($('#proofbutt'+quizId), "b", "You have completed this section! " + res,2);

                 });
          } else{
            makeAlert($('#proofbutt'+quizId), "b", "Something wasn't quite right. Fix your answer and press submit again. ",4);
          }

        })

    })


})
