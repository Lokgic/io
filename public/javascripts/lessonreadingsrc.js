$(function(){
  var makeAlert = require('./mods/alert.js')
  function checkCheckboxAnswers(moduleNum, exId, data){

      var checked = [];
      var answers = [];
      var right = 0;
      for (var i = 0;i<data.ex[exId].questions.length;i++){
        answers.push(data.ex[exId].questions[i][1]);
        checked.push(document.getElementById(exId+"-"+i).checked);
        if (answers[i] == checked[i]){
          right++;
        }
      }
      // console.log(right +  " " + answers.length)
      if (right != answers.length) return false;
        else return true;
      // return [right, answers.length];


  }

  function loadJSON(id, callback){
          $.getJSON('../json/'+id + '.json')
          .done(function(data){
          callback(null, data);
       }).fail(function(){body.append('Failed to Load Data')});

      }
  $allbutts = $('.readingbutt');

  $allbutts.on('click', function(){
    var location = "#" + $(this).attr("id");
    var target = $(this).val();
    var moduleNum = target.split("-")[0];
    var exId = target.split("-")[1];
    var type = target.split("-")[2];
    console.log(exId)
    loadJSON("lesson" + moduleNum,function(err,data){
      if (type == "check"){
      // console.log(checkCheckboxAnswers(moduleNum,exId,data));
        if (!checkCheckboxAnswers(moduleNum,exId,data)) {
          // console.log(checkCheckboxAnswers(moduleNum,exId,data));
          makeAlert(location, "a", "Unfortunately this is not correct. Fix your answers and submit again",4)
        } else{
          jQuery.post("/report", {label: exId, moduleNo: moduleNum}, function(res){
                  makeAlert($(location), "a", "You have completed this section! " + res,2);
               });
          // makeAlert(location, "a", "right",1)
        }
    }
  })


  })

  // console.log($allbutts)

})
