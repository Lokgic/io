$(function(){



  var uid = document.getElementById('mainnavbar').getAttribute('data')
  expInit(uid)



})



function expInit(uid, callback) {
    jQuery.post("/getExp/" + uid)
        .done(function(d) {

            document.getElementById('exp').innerHTML = d.string;
            document.getElementById('exp').setAttribute('data', d.lvl)
            if (callback) return callback(d)
        }).fail(function(f) {
            console.log(f)
        })
      };

function getExp(uid, callback) {
    jQuery.post("/getExp/" + uid)
        .done(function(data) {
            callback(null, data);
        }).fail(function(f) {
            console.log(f)
        })
      };
