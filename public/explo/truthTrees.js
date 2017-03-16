$(function(){
  explanation = d3.select('.explanation')
  interaction = d3.select('.interaction')

  function drawTree(treeData,div){
    console.log(treeData)
    // set the dimensions and margins of the diagram
    var svg = d3.select(div).append("svg")
    var scope = d3.select(div)
    var dimensions ={}
    function setDimensions(){
      dimensions.width = d3.select(div).node().getBoundingClientRect().width
      dimensions.height = d3.select('.explocontainer').node().getBoundingClientRect().height
      svg.attr("width", dimensions.width)
      .attr("height", dimensions.height)
      // console.log(dimensions)
    }
    console.log(d3.select(div).node().getBoundingClientRect())


    setDimensions();
    // var originalPos = dimensions.top/3


    var margin = {top: 40, right: 20, bottom: 40, left: 20},
        width = dimensions.width - margin.left - margin.right,
        height = dimensions.height - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([width, height]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData);

    // maps the node data to the tree layout
    nodes = treemap(nodes);


        g = svg.append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


    var link = g.selectAll(".link")
        .data( nodes.descendants().slice(1))
      .enter().append("path")
        .attr('class', function(d,i){
          if (d.depth >4 && d.depth <7 ) var tag = "set1"
          else if (d.depth <8 &&d.depth >5) var tag = "set2"
          else if (d.depth  >7)var tag = "set3"
          else var tag = "set0"
          return tag + " link depth"+d.depth
        })
        .attr("d", function(d) {
          // console.log(d)
           return "M" + d.x + "," + d.y
             + "C" + d.x + "," + (d.y + d.parent.y) / 2
             + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
             + " " + d.parent.x + "," + d.parent.y;
           });
    //
    // // adds each node as a group
    var node = g.selectAll(".node")
        .data(nodes.descendants())
      .enter().append("g")
        .attr("class", function(d) {
          if (d.depth >4 && d.depth <7 ) var tag = "ngroup1"
          else if (d.depth <11 &&d.depth >6) var tag = "ngroup2"
          else var tag = "ngroup0"
          return  tag+ " depth"+d.depth + " node" +
            (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; });

    //
    //       // adds the circle to the node
          node.append("circle")
            .attr("r", 30)
    //
    //       // adds the text to the node
          node.each(function(d) {
              if (_.contains(d.data.name.split(''),'|')){
                // console.log(this)
                var t = d3.select(this).append('text')
                .style("text-anchor", "middle")
                var textchunks = d.data.name.split('|')
                var y = 1
                for (chunck in textchunks){
                  t.append('tspan')
                    .attr('x',0)
                    .attr('dy', 2 *(chunck+1))
                    .text(textchunks[chunck])
                }

              }
              else {
                d3.select(this)
                .append("text")

                .attr('stroke-fill','grey')
                .attr("y", function(d) { return 8; })
                .style("text-anchor", "middle")
                .text(d.data.name);
            }
            })


  }


  $.getJSON("explos.json", function(json) {
    console.log(json.truthTrees); // this will show the info it in firebug console
    var section1 = json.truthTrees.sections[0]
    // explanation.append('h3').text(section1.title)
    tabulate(section1.data.anatomy,".leftBottom")
    drawTree(section1.data.anatTree,".interaction")
    mathJax.reload()
  });


})
