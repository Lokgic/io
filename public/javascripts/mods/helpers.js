var alert = function(msg, color, location){
  if (location == undefined) location = "bottom right"
      notifyMsg = msg
      notifyOption = {
          style: color,
          position: location
      }

    $.notify(notifyMsg,notifyOption)
    }
var getUid = function(){
  return $('#mainnavbar').attr('data')
}

module.exports.recordCompletion = function recordCompletion(uid,mod,chapter,section){
  var data = {
      uid: uid,
      module: mod,
      chapter: chapter,
      section: section
  }
  $.ajax({
      url: '/data/record',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      success: function(res) {
          //On ajax success do this
          console.log(res)
          console.log("success message " + res.message)
      }
  });
}

module.exports.recordLeader = function recordLeader(uid,logicise,score){
  var data = {
      uid: uid,
      logicise: logicise,
      score: score
  }
  $.ajax({
      url: '/data/leader',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      success: function(res) {
          //On ajax success do this
          console.log(res)
          console.log("success message " + res.message)
      }
  });
}

module.exports.sendAttempts = function sendAttempts(dataSet){


  // console.log(toSend)
  $.ajax({
      url: '/data/attempt',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(dataSet),
      dataType: 'json',
      success: function(res) {
          //On ajax success do this
          console.log(res)
          console.log("success message " + res.message)
      },
      error: function(res) {
          //On ajax success do this
        console.log(res)
          console.log("error message " + res.message)
      }
  });
}
module.exports.alert = alert;
module.exports.getUid = getUid;
