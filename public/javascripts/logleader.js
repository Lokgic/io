$(function(){
  var width = $('#leaderboard').width()
  // console.log(width)
  var height = window.innerHeight;
  var barPadding = 10;
  var color = d3.scaleOrdinal(d3.schemeSet1);
  var logiciseID = d3.select('main').attr('id')



  //  console.log(shade(0.5))
  function ping(callback){
  		jQuery.post("/leaderboard/"+logiciseID, function (res){
  			return callback(res);
  		})
  	}





  function drawLeader(){
    ping(function(data){
      if (data.length == 0){

        return

      }
      var highest = data[0].score;
      var lowest = data[data.length-1].score
      function scale(x){
        var y = d3.scaleLinear()
                        .domain([lowest,highest])
                        .range([0.1,1])

        return  d3.interpolateGnBu(y(x))
      }
      console.log(highest)


      // console.log(data)
      //top3



      //bars
      var yPadding = 30
      var barHeight = Math.min((height / data.length)*.80,25)

      var leftMargin = 10;
      var rightMargin = 30
      var topMargin = 80
      var yMult = barHeight + yPadding;
      var widthScale = d3.scaleLinear()
                          .domain([0,data[0].score])
                          .range([0,width - rightMargin])
      var bars = svg.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")

      bars.attr("x", function(d, i) {
            return leftMargin;
          })
          .attr("y", function(d,i){
            return i*yMult +yPadding
          })
          .attr("width", 0)
          .attr("height", barHeight)
           .transition()
           .duration(200)
           .delay(function (d, i) {
             return i * 50;
           })
          .attr("width", function(d){
            // console.log(d.score)
            return widthScale(d.score) })
          .attr('fill',function(d){return scale(d.score)})

          svg.selectAll("text") .data(data) .enter() .append("text")
          .text(function(d) {

            return d.nickname+": " +d.score;
          })
          .attr("x", function(d, i) {
            return leftMargin ;
          })
          .attr("y", function(d,i){
            return i*yMult +yPadding -5
          })
          .attr('fill','black')
          .attr("text-anchor","start")




        })

        d3.select('#leaderclose').on('click',function(){
          closeNav()
          svg.remove()
        })

      var board = d3.select('#board')
      var svg = board.append('svg').attr('width',width).attr('height',height)


  }

  drawLeader()



})
