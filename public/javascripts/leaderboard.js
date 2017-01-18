$(function(){
  var width = 400
  var height = width + 200
  var barPadding = 10;
  var logiciseID = d3.select('main').attr('id')
  function openNav() {
    document.getElementById("leaderboard").style.width = width+"px";
  }

  function closeNav() {
    document.getElementById("leaderboard").style.width = "0";
  }



  d3.select('#leaderboardButt').on('click',function(){
    ping(function(data){
      console.log(data)
      var yPadding = 30
      var barHeight = Math.min((height / data.length)*.80,50)

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
          .attr('fill',function(d){return color(d.score)})

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



          openNav()
        })

        d3.select('#leaderclose').on('click',function(){
          closeNav()
          svg.remove()
        })

      var board = d3.select('#board')
      var svg = board.append('svg').attr('width',width).attr('height',height)
      var color = d3.scaleOrdinal(d3.schemeSet1);


  function ping(callback){
  		jQuery.post("/leaderboard/"+logiciseID, function (res){
  			return callback(res);
  		})
  	}


  })





})