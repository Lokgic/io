$(function() {

    function loadTree(callback){
      $.post('/processing/alienTree/alienTree1/30')
      .done(function(d){
        callback(d)
      })
    }

    loadTree(function(data){
      console.log(data)
      var dimensions = {}
       dimensions.width = $('#display').width();
       dimensions.height = window.innerHeight*.7;
      //  console.log(dimensions)

      // set the dimensions and margins of the diagram
      var margin = {top: 50, right:30, bottom: 100, left: 30},
          width = dimensions.width - margin.left - margin.right,
          height = dimensions.height - margin.top - margin.bottom;
      var root = d3.stratify()
          .id(function(d) {
              return d.name;
          })
          .parentId(function(d) {
              return d.parent;
          })
          (data.relation);


      var treemap = d3.tree()
          .size([width,height]);


      // maps the node data to the tree layout
      nodes = treemap(root);
      console.log(nodes)
      var svg = d3.select("#display").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom),
          g = svg.append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      var link = g.selectAll(".link")
          .data(nodes.descendants().slice(1))
          .enter().append("path")
          .attr("class", "link")
          .attr("d", function(d) {
            return "M" + d.x + "," + d.y
         + "L" + d.parent.x + "," + d.parent.y;
          });

      // adds each node as a group
      var node = g.selectAll(".node")
          .data(nodes.descendants())
          .enter().append("g")
          .attr("class", function(d) {
              return "node" +
                  (d.children ? " node--internal" : " node--leaf");
          })
          .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
          });

          d3.xml("../img/alien.svg", function(xml) {

    // Take xml as nodes.
          var imported_node = document.importNode(xml.documentElement, true);
         node.each(function(d){

           var imported_svg = this.appendChild(imported_node.cloneNode(true));
           d3.select(imported_svg)
           .style('fill',   d.data.color   )
           .attr('width','30')
           .attr('height','40')
           .attr("x", "-15")
           .attr("y", "-25")
         })

        });

      // adds the text to the node
      node.append("text")
          .attr("dy", ".35em")
          .attr("x", 25)
          .style("text-anchor", "start")
          .text(function(d) {
              return d.data.constant +": "+d.data.name;
          });

    })
    var table = [{
            "name": "Eve",
            "parent": "",
            "color":"red"
        },
        {
            "name": "Cain",
            "parent": "Eve",
            "color":"red"
        },
        {
            "name": "Seth",
            "parent": "Eve",
            "color":"red"
        },
        {
            "name": "Enos",
            "parent": "Seth",
            "color":"red"
        },
        {
            "name": "Noam",
            "parent": "Seth",
            "color":"red"
        },
        {
            "name": "Abel",
            "parent": "Eve",
            "color":"red"
        },
        {
            "name": "Awan",
            "parent": "Eve",
            "color":"green"
        },
        {
            "name": "Enoch",
            "parent": "Awan",
            "color":"teal"
        },
        {
            "name": "Azura",
            "parent": "Eve",
            "color":"blue"
        }
    ]

  //   var dimensions = {}
  //    dimensions.width = $('#display').width();
  //    dimensions.height = window.innerHeight*.7;
  //    console.log(dimensions)
  //
  //   // set the dimensions and margins of the diagram
  //   var margin = {top: 50, right:30, bottom: 100, left: 30},
  //       width = dimensions.width - margin.left - margin.right,
  //       height = dimensions.height - margin.top - margin.bottom;
  //   var root = d3.stratify()
  //       .id(function(d) {
  //           return d.name;
  //       })
  //       .parentId(function(d) {
  //           return d.parent;
  //       })
  //       (table);
  //
  //
  //   var treemap = d3.tree()
  //       .size([width,height]);
  //
  //
  //   // maps the node data to the tree layout
  //   nodes = treemap(root);
  //   console.log(nodes)
  //   var svg = d3.select("#display").append("svg")
  //       .attr("width", width + margin.left + margin.right)
  //       .attr("height", height + margin.top + margin.bottom),
  //       g = svg.append("g")
  //       .attr("transform",
  //           "translate(" + margin.left + "," + margin.top + ")");
  //
  //   var link = g.selectAll(".link")
  //       .data(nodes.descendants().slice(1))
  //       .enter().append("path")
  //       .attr("class", "link")
  //       .attr("d", function(d) {
  //         return "M" + d.x + "," + d.y
  //      + "L" + d.parent.x + "," + d.parent.y;
  //       });
  //
  //   // adds each node as a group
  //   var node = g.selectAll(".node")
  //       .data(nodes.descendants())
  //       .enter().append("g")
  //       .attr("class", function(d) {
  //           return "node" +
  //               (d.children ? " node--internal" : " node--leaf");
  //       })
  //       .attr("transform", function(d) {
  //           return "translate(" + d.x + "," + d.y + ")";
  //       });
  //
  //       d3.xml("../img/alien.svg", function(xml) {
  //
  // // Take xml as nodes.
  //       var imported_node = document.importNode(xml.documentElement, true);
  //      node.each(function(d){
  //
  //        var imported_svg = this.appendChild(imported_node.cloneNode(true));
  //        d3.select(imported_svg)
  //        .style('fill',   d.data.color   )
  //        .attr('width','30')
  //        .attr('height','40')
  //        .attr("x", "-15")
  //        .attr("y", "-25")
  //      })
  //
  //     });
  //
  //   // adds the text to the node
  //   node.append("text")
  //       .attr("dy", ".35em")
  //       .attr("x", 25)
  //       .style("text-anchor", "start")
  //       .text(function(d) {
  //           return d.data.name;
  //       });

})
