$(function(){

  var width = 960,
      height = 700,
      radius = (Math.min(width, height) / 2) - 10;
  var pack = d3.pack()

  var svg = d3.select(".scroll").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

  d3.json("/json/instruments.json", function(error, root){
    if (error) throw error;
    root = d3.hierarchy(root).sum(function(d) { return 1; })
    console.log(root)
  })

})
