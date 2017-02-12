$(function(){





    // set the dimensions and margins of the diagram
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
            .attr("r", 15)
    //
    //       // adds the text to the node
          node.append("text")
            .attr("dy", ".35em")
            .attr("y", function(d) { return 8; })
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.name; })
            .attr('font-size','12')
            .attr('stroke-fill','grey')
})
