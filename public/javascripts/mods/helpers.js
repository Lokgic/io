var alert = function(msg, color, location){
  if (location == undefined) location = "bottom right"
      notifyMsg = msg
      notifyOption = {
          style: color,
          position: location
      }

    $.notify(notifyMsg,notifyOption)
    }

module.exports.alert = alert;
