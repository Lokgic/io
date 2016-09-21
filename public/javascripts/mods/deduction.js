var randomize = require('./randomize.js')

var lineleft = 'style ="border-right: 0px;border-bottom: 0px;border-top: 0px;border-left: 1px ;border-style: solid;"';




var draw = function(proof){
  var maxcol = 2
  var html = '<table class="table table-sm"><tbody>';
  var num = 0
  for (line in proof){
    num++;
    html += '<tbody><tr><th scope="row" >'+ num+'</th>';

    if (proof[line].scope > 1){
      console.log(proof[line].content + " " + proof[line].scope);
      for (var i = 1; i < proof[line].scope; i++){
        html +=' <td '+ lineleft +'> </td>';
      }

    }

    html +=' <td colspan="' + (maxcol + 1  - proof[line].scope) +'"'+ lineleft + '>';

    html += proof[line].content + '</td>';
    html += '<td>' + proof[line].justification + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>'
  return html;
}

var randomJustification = function(proof){
  var maxcol = 2
  var html = '<table class="table table-sm"><tbody>';
  var num = 0
  var question = 1;
  while (proof[question - 1].justification == "Given"||proof[question - 1].justification == "Assumption"){
    question = randomize.oneNumber(proof.length);
  }
  console.log(question);
  for (line in proof){
    num++;
    html += '<tbody><tr><th scope="row" >'+ num+'</th>';

    if (proof[line].scope > 1){
      for (var i = 1; i < proof[line].scope; i++){
        html +=' <td '+ lineleft +'> </td>';
      }

    }

    html +=' <td colspan="' + (maxcol + 1  - proof[line].scope) +'"'+ lineleft + '>';

    html += proof[line].content + '</td>';
    if (num != question) html += '<td>' + proof[line].justification + '</td>';
    else html += '<td></td>';
    html += '</tr>';
  }
  html += '</tbody></table>'
  return html;
}

module.exports = {draw: draw,
                  randomJustification: randomJustification}
