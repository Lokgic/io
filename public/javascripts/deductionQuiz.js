$(function(){
  var status = "active"
  d3.select('#leaderboard').remove()
  var quizId = d3.select('#display').text()
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
    data = data[quizId]
    for (q in data){
      var id = 'q'+q
      var div = main.append('div').attr('id',id).attr('class','fitch')
      div.append('h4').text(q+".")
      if (data[q].background.type == 'fitch'){
        drawDeduction("#"+id, data[q].background.substance)
      }
      var n = _.random(data[q].question.length - 1)
      div.append('p').text(data[q].question[n].text)
      var buttgroup = div.append('div').attr('class','btn-group').attr('id','butt'+id).attr('data-toggle','buttons')
      if (data[q].question[n].type == "checkbox"){
        var pool = _.union(data[q].question[n].correct,data[q].question[n].incorrect)
        pool = _.first(_.shuffle(pool),Math.min(5,pool.length))
        console.log(pool)
        buttgroup.selectAll('label')
                  .data(pool)
                  .enter()
                  .append('label')
                  .attr('class','btn btn-mc m-x-1')
                  .text(function(d){
                    return d;
                  })
                  .attr('data',function(d){
                    if (_.contains(data[q].question[n].correct,d)) return true;
                    else return false;
                  })
                  .attr('q',id)
                  .append('input')
                  .attr('type','checkbox')
                  .attr('autocomplete','off')





        // for (var i = 0;i<Math.min(pool.length, 5);i++){
        //   buttgroup.append('label').attr('class','btn btn-primary m-x-1').text(pool[i]).append('input').attr('type','checkbox').attr('autocomplete','off').attr('data',pool[i])
        // }
      }
      div.selectAll('.btn').on('click',function(d){
        console.log(d3.select(this).classed('active'))
        console.log(d3.select(this).attr('data'))
        console.log(this)
      })

    }
    d3.select('#confirm').on('click',function(){
      if (status == "done") location.reload()
      else{
        status = "done"
        var wrong = []
        main.selectAll('.btn').each(function(d){
          // console.log(this)
          // console.log(d3.select(this).classed('active'))
          if (d3.select(this).classed('active')+"" != d3.select(this).attr('data')){
            wrong.push(d3.select(this).attr('q'))
          }

        })
        if (wrong.length!=0){
          for (id in wrong){
            d3.select('#'+wrong[id]).style('background-color','red')

          }
          $.notify("Unfortunately this is incorrect. Questions with wrong selection(s) are marked red. Press 'Confirm' again to continue.",{"style":"incorred"})
        }else{
          $.notify("Flawless - you have passed this quiz.",{"style":"incorred"})
          recordCompletion(uid,"nd","logicise",quizId)
        }
        console.log(wrong)
      }

    })
    mathJax.reload('#display')
    // console.log(data)
  })

})
