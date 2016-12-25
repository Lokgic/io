var d3 = require('d3')



var root = {
  "name": "overview",
  "children":[
    {
      "name": "Sentential Logic",
      "children":[
        {"name": "Exercises",
          "children":[

          ]},
        {"name": "Quizzes", "size":2},
        {"name": "Assignments", "size":3},
        {"name": "Test", "size": 1}
      ]
    },
    {
      "name": "Predicate Logic",
      "children":[
        {"name": "Exercises", "size":1},
        {"name": "Quizzes", "size":2},
        {"name": "Assignments", "size":1},
        {"name": "Test", "size": 4}
      ]
    },
    {
      "name": "Natural Deduction",
      "children":[
        {"name": "Exercises", "size":7},
        {"name": "Quizzes", "size":2},
        {"name": "Assignments", "size":3},
        {"name": "Test",
        "children":[
          {"name": "t", "size": 1}
        ]}
      ]
    },
    {
      "name": "Identity",
      "children":[
        {"name": "Exercises", "size":3},
        {"name": "Quizzes", "size":3},
        {"name": "Assignments", "size":5},
        {"name": "Test", "size": 5}
      ]
    }
  ]
}




var width = 960,
    height = 700,
    radius = (Math.min(width, height) / 2) - 10;

var formatNumber = d3.format(",d");

var x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

var y = d3.scaleSqrt()
    .range([0, radius]);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var partition = d3.partition();

var arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y1)); });


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    root = d3.hierarchy(root);
    root.sum(function(d) { return d.size; });
    svg.selectAll("path")
        .data(partition(root).descendants())
      .enter().append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })


//
// var colorCircle = svg.append('g')
// .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');
//
//
// var path = colorCircle.selectAll('path')
//   .data(pie(dataset))
//   .enter()
//   .append('path')
//   .attr('d', arc)
//   .attr('fill', function(d, i) {
//     return color(d.data.label);
//   });
