var d3 = require('d3')


var scrollTop = 0
var newScrollTop = 0

var container = d3.select('#con')
var panel = d3.selectAll('.panel')
var sticky = d3.select('#sticky')

var WIDTH = window.innerWidth
 var HEIGHT = window.innerHeight


var svg = d3.select('#sticky')
        .append("svg")
svg.attr("width", WIDTH)
    .attr("height", HEIGHT)

// circle = svg.append("circle")
//
// circle.attr("cx", "50%")
//       .attr("cy", "50%")
//       .attr("r", 30)
//

line = svg.append("line")
line.attr("x1", 121)
    .attr("y1", HEIGHT/2)
    .attr("x2", 152)
    .attr("y2", HEIGHT/2)
    .attr("stroke-width","2")
    .attr("stroke","black")


container.on("scroll.scroller", function() {
    newScrollTop = container.node().scrollTop

    // console.log("works?")
  });



  var render = function() {
    // Don't re-render if scroll didn't change
    if (scrollTop !== newScrollTop) {
      scrollTop = newScrollTop
      // Graphics Code Goes Here
      x = parseInt(line.attr('x2'));
      console.log("x " +x)
      line.attr('x2', scrollTop)
    }
    window.requestAnimationFrame(render)
  }

  window.requestAnimationFrame(render)
