$(function(){
  d3.select('#leaderboard').remove()
  main = d3.select('#display').style('text-align','left').style('padding-top','100px').style('padding-bottom','100px').html("")
  function drawDeduction(div,lines,der){
      var area = d3.select(div)
      console.log(area)
      if (der) var der = area.append('h4').text(der).attr('class','derivation')


      var scope1 = area.append('div')
                        .attr('id','scope1')
                        .attr('class','scope')

      var currentScope = 1
      for (line in lines){
        var n = parseInt(line) + 1
        var text = (n) +". " + lines[line][1]
        if (lines[line][0] == currentScope + 1){
          newScope = 1 + currentScope;
          area.select('#scope' + currentScope).append('div').attr('id', 'scope'+newScope).attr('class','scope')
          // $('#scope' + currentScope).append("<div id = scope" + newScope + " class = 'scope'></div")
          currentScope = newScope;
        } else if (lines[line][0] == currentScope - 1) currentScope -= 1;
          var classInfo,idInfo
          idInfo = n
          if (lines[line][3] == null) classInfo = "line HSable";
          else{
            classInfo = (lines[line][3].ass)? "ass HSable" :"line HSable";
            classInfo += (lines[line][3].hoverable)? " hoverable" :"";
          }


          var lineDiv = area.select('#scope' + currentScope).append("div").attr('id',"line"+idInfo).attr('class',classInfo).text(text)
          lineDiv.append('div').attr('class','just').text(lines[line][2])
      }

      d3.selectAll('.hoverable')
        .on('mouseover',function(){
          var id = d3.select(this).attr('id')
          var dim = d3.select(div).node().getBoundingClientRect()

        })
  }


  $.getJSON("/json/deductionQuiz.json", function(data){

    for (q in data){
      var id = 'q'+q
      var div = main.append('div').attr('id',id).attr('class','fitch')
      div.append('h4').text(q+".")
      if (data[q].background.type == 'fitch'){
        drawDeduction("#"+id, data[q].background.substance)
      }
      div.append('p').text(data[q].question[0].text)
    }
    mathJax.reload('#display')
    console.log(data)
  })

})
