$(function(){
  function load(v,callback){
    jQuery.post("../processing/truthTable/truthTable1/"+v)
    .done(function(data){
        callback(null, data);
    }).fail(function(){$body.append('Failed to Load Quiz')})
  };
  var toPass = 15
  d3.select('#passingscore').text(toPass)
  var currentScore = 0
  score = d3.select('#score')
  score.text(currentScore)
  var difficulty = 1
  d3.select('#difficulty').text(difficulty)
  var u = 0
  var state = "input"
  var currentProblem;

  function makeProblem(difficulty){

    load(difficulty,function(err,data){
      currentProblem = data;
      u = u + 1;
      var con = d3.select('#display').append('div').attr('class','tableContainer')
      var table = tabulate(currentProblem,'.tableContainer',"fill")
      var input = table.selectAll('.blank')
      input.on('mouseover',function(d){
        if (state == "input") d3.select(this).style('background','#eee')
      })
      .on('mouseout',function(d){
        if (state == "input") d3.select(this).style('background','#fff')
      })
      .on('click',function(d){
        if (state == "input"){
          if (d3.select(this).attr('data') == "T"){
            d3.select(this).attr('data','F')
            d3.select(this).text('F')
          }else {
            d3.select(this).attr('data','T')
            d3.select(this).text('T')
          }
        }


      })
      mathJax.reload()

    })



  }


  var button = d3.select('#confirm')
  button.on('click',function(){
    if (state == "input"){
      state = "next"
      // for (row in currentProblem.column){
      //   input.push(d3.select('#row'+row).attr('data'))
      // }
      var correct = true
      d3.selectAll('.blank').each(function(d,i){
        if(d3.select(this).attr('data') != currentProblem[2].column[i]){
          d3.select(this).style('background', 'red')
          correct = false;
        }else{
          d3.select(this).style('background', 'blue')

        }
      })
      if (correct) {
        currentScore += 1;
        score.text(currentScore);
      }
      else{
        state = "restart"
      }
    }else if (state == "next"){
      if (currentScore == 3) difficulty += 1;
      else if (currentScore == 9) difficulty += 1;
      d3.select('#difficulty').text(difficulty)
      makeProblem(difficulty)
      state = "input"
    }else if (state == "restart"){
      location.reload();
    }
  })

  makeProblem(difficulty)
})
