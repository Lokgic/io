var alert = function(msg, color, location){
  if (location == undefined) location = "bottom right"
      notifyMsg = msg
      notifyOption = {
          style: color,
          position: location
      }

    $.notify(notifyMsg,notifyOption)
    }
// var prepareAttempts = function(set,uid,correct){
//   var output = []
//   set.forEach(function(problem){
//     var i = (correct)?
//     var temp = {
//       uid:uid,
//       pid:problem.pid,
//       type:problem.type,
//       input:problem.input,
//       correct:correct,
//     }
//   })
// }

module.exports.alert = alert;
