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
               d3.select(allCells[n]).style('opacity',0)
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
                 d3.selectAll('.link'+x).style('opacity',0)


               }


              // console.log(_.contains(d.data.cell,6))

           }
          //  console.log(i)
         })
         .on("mouseout",function(){
           d3.selectAll('td').style('opacity',1)
           for (var x = 0;x<7;x++){
             d3.selectAll('.link'+x)
                .style('opacity',1)
              d3.selectAll('.text'+x)
                 .style('opacity',1)

            }

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
    console.log(json.truthTrees); // this will show the info it in firebug console
    var section1 = json.truthTrees.sections[0]
    // explanation.append('h3').text(section1.title)
    tabulate(section1.data.anatomy,".leftBottom")
    drawTree(section1.data.anatTree,".interaction")
    mathJax.reload()
  });


})
