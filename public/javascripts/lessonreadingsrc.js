$(function(){
  // var makeAlert = require('./mods/alert.js')


  function loadJSON(id, callback){
          $.getJSON('../json/'+id + '.json')
          .done(function(data){
          callback(null, data);
       }).fail(function(){body.append('Failed to Load Data')});

      }
  $allbutts = $('.readingbutt');

  $allbutts.on('click', function(){
    var target = $(this).val();
    var moduleNum = target.split("-")[0];
    var exId = target.split("-")[1];
    loadJSON("lesson" + moduleNum,function(err,data){
      console.log(data);
    })
  })

  // console.log($allbutts)

})
