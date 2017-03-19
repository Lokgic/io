$(function(){

  function drawDeduction(div,lines,der){
      var area = d3.select(div)
      area.append('h4').text(der).attr('class','derivation')
      var scope1 = area.append('div')
                        .attr('id','scope1')
                        .attr('class','scope')

      var currentScope = 1
      for (line in lines){
        var n = parseInt(line) + 1
        var text = (n) +". " + lines[line][1]
        if (lines[line][0] == currentScope + 1){
          newScope = 1 + currentScope;
          d3.select('#scope' + currentScope).append('div').attr('id', 'scope'+newScope).attr('class','scope')
          // $('#scope' + currentScope).append("<div id = scope" + newScope + " class = 'scope'></div")
          currentScope = newScope;
        } else if (lines[line][0] == currentScope - 1) currentScope -= 1;
          var classInfo,idInfo
          idInfo = n
          classInfo = (lines[line][3] == true)? "ass" :"line";


          var lineDiv = d3.select('#scope' + currentScope).append("div").attr('id',idInfo).attr('class',classInfo).text(text)
          lineDiv.append('div').attr('class','just').text(lines[line][2])
      }
  }

  $.getJSON("deduction.json", function(json) {
    // console.log(json.truthTrees); // this will show the info it in firebug console

    var title = d3.select('.exploTitle').attr('id')
    var data  = json[title]
    drawDeduction('.interaction',data.proof,data.derivation)
    console.log(data)
    mathJax.reload()

  });

})
