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

module.exports.alert = alert;
module.exports.getUid = getUid;
