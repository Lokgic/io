$(function(){

  var tooltipData
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  function drawTree(treeData,div){
    // console.log(treeData)
    // set the dimensions and margins of the diagram
    var svg = d3.select(div).append("svg")
    var scope = d3.select(div)
    var dimensions ={}
    function setDimensions(){
      // var winDi = d3.select(div).node().getBoundingClientRect();
      // console.log(winDi)
      dimensions.width = d3.select(div).node().getBoundingClientRect().width
      if (window.innerWidth < window.innerHeight){
        dimensions.height = dimensions.width
        // d3.select('.carousel-inner').style('height','150vh')
      }else{

        dimensions.height = d3.select('.explocontainer').node().getBoundingClientRect().height


      }
      console.log(dimensions)
      svg.attr("width", dimensions.width)
      .attr("height", dimensions.height)
      // console.log(dimensions)
    }
    // console.log(d3.select(div).node().getBoundingClientRect())


    setDimensions();
    // var originalPos = dimensions.top/3


    var margin = {top: 60, right: 30, bottom: 60, left: 30},
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
          return 'link link'+i
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
        .attr("class", function(d,i) {

          return   "node" +
            (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; });

    //
    //       // adds the circle to the node
          node.append("circle")
            .attr('class',function(d,i){
              return 'circle'+i
            })
            .attr("r", 30)
         .on('mouseover', function(d,i){
           var allCells = d3.selectAll('td')._groups[0]
           for (var n = 0; n<allCells.length;n++){
             if (!_.contains(d.data.cell,parseInt(n))){
               d3.select(allCells[n])
               .transition()
               .style('background','black')
               d3.select(allCells[n])
               .transition()
               .style('opacity',0)
               // console.log(allCells[n])
             }
          }

             for (var x = 0;x<7;x++){
              //  d3.select('.entity'+i+' .link').style('opacity',0)
               if (!_.contains(d.data.node,parseInt(x))){
                //  d3.select('.link'+i).style('opacity',0)
                //  d3.selectAll('.link'+x).style('opacity',0)
                 d3.selectAll('.text'+x).style('opacity',0)


               }

               if (!_.contains(d.data.link,parseInt(x))){
                //  d3.select('.link'+i).style('opacity',0)
                //  d3.selectAll('.link'+x).style('opacity',0)
                 d3.selectAll('.link'+x).transition().style('opacity',0)


               }


               tooltip.html('')
                     .append('p')
                     .text(tooltipData[i])
              if (window.innerWidth < window.innerHeight || window.innerWidth <600){
                tooltip.style("right",  "10px")
                    .style("top", "30px")
              }else{
                tooltip.style("left", (d3.event.pageX)-350 + "px")
                    .style("top", (d3.event.pageY) - 90 + "px")
              }


                  tooltip .style('background','white')
                   .style("color", 'black')
                tooltip.transition()
                .duration(200)
                .style("opacity", .9);


              // console.log(_.contains(d.data.cell,6))

           }
          //  console.log(i)
         })
         .on("mouseout",function(){
           d3.selectAll('td')
           .transition()
           .style('background','white')
           .style('opacity',1)

           for (var x = 0;x<7;x++){
             d3.selectAll('.link'+x)
             .transition()
                .style('opacity',1)
              d3.selectAll('.text'+x)
                 .style('opacity',1)

            }

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);

         })
    //       // adds the text to the node
          node.each(function(d,i) {
              if (_.contains(d.data.name.split(''),'|')){
                // console.log(this)
                var t = d3.select(this).append('text')
                .style("text-anchor", "middle")
                .attr('class','text'+i)
                var textchunks = d.data.name.split('|')
                var y = 1
                for (chunck in textchunks){
                  t.append('tspan')
                    .attr('x',0)
                    .attr('dy', 2 *(chunck+1))
                    .text(textchunks[chunck])
                    .attr('class','text'+i)
                }

              }
              else {
                d3.select(this)
                .append("text")

                .attr('stroke-fill','grey')
                .attr('class','text'+i)
                .attr("y", function(d) { return 8; })
                .style("text-anchor", "middle")
                .text(d.data.name);
            }
            })


  }


  $.getJSON("explos.json", function(json) {
    // console.log(json.truthTrees); // this will show the info it in firebug console


    var section1 = json.truthTrees.sections[0]
    var leftTop = d3.select('.leftTop')
    leftTop.append('p')
            .attr('class','text-justify')
            .text(section1.text["anatomy"])
    // explanation.append('h3').text(section1.title)
    tabulate(section1.data.anatomy,".leftBottom")
    drawTree(section1.data.anatTree,".interaction")
    tooltipData = section1.tooltip
    mathJax.reload()

  });


})
