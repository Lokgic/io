$(function() {

  var uid = $('#mainnavbar').attr('data')

    completeColor = "#444C5C"

    var color = {
      "root":"#444C5C",
      "module":"#3B596A",
      "task":"#427676",
      "subtask":'#3F9A82',
      "chapter":'#A1CD73',
      "section":"#ECDB60"
    }

    d3.select('#getProfile').on('click',function(){
      uid = document.getElementById('uid').value
      console.log(uid)

      loadProfile(uid,function(err,data){
        // for (dp in data){
        //   if (data[dp].chapter == "pset"){
        //     treeData[data[dp].module[1]][1][dp].completed = true
        //   }
        // }
        // d3.select('main').html("")
        drawTree(data)
        console.log(data)
      })
    })



    function loadProfile(uid,callback){
      $.post("/profile/"+uid)
        .done(function(data){
          callback(null,data);
        }).fail(function(f){
          console.log(f)
        })
    }

    loadProfile(uid,function(err,data){
      // for (dp in data){
      //   if (data[dp].chapter == "pset"){
      //     treeData[data[dp].module[1]][1][dp].completed = true
      //   }
      // }
      drawTree(data)
      console.log(data)
    })

    var main = '#profileTree'


    // set the dimensions and margins of the diagram
    var margin = {
            top: 200,
            right: 200,
            bottom: 50,
            left: 100
        },
        width = 1.5*$(main).width()- margin.left - margin.right;
        height = 1.5*$(main).height() - margin.top - margin.bottom;

         d3.select('body').style('background','rgb(211,211,211)')
    var svg = d3.select(main).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)



    g = svg.append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // svg.append("rect")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .style("fill", "none")
    //     .style("pointer-events", "all")
    //     .call(d3.zoom()
    //         .scaleExtent([1 / 2, 4])
    //         .on("zoom", zoomed));
    //
    // function zoomed() {
    //   g.attr("transform", d3.event.transform);
    // }

  //   function nozoom() {
  //   d3.event.preventDefault();
  // }



    var linear = d3.scaleOrdinal()
    .domain(["Module","Task","Subtask","Chapter","Section"])
    .range(["#3B596A","#427676","#3F9A82","#A1CD73","#ECDB60",]);



  svg.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(100,100)");

  var legendLinear = d3.legendColor()
    .shapeWidth(100)
    .orient('horizontal')
    .scale(linear);

  svg.select(".legendLinear")
    .call(legendLinear);


    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function drawTree(treeData){
      // declares a tree layout and assigns the size
      // gradient.html('<stop offset="0%" stop-color="red"/>  <stop offset="50%" stop-color="black"/> <stop offset="100%" stop-color="blue"/>')
      var completion = treeData.tasksList.length/18

      var gradient = svg.append('defs').append('linearGradient').attr('id','gradient').attr('y2',1).attr('y1',0).attr('x1',1).attr('x2',1).attr('spreadMethod','pad')
      gradient.append('stop').attr('offset',1 - completion).attr('stop-color','white')

      gradient.append('stop').attr('offset',completion).attr('stop-color','#444C5C')

      var treemap = d3.tree()
          .size([height, width]);

      //  assigns the data to a hierarchy using parent-child relationships
      var nodes = d3.hierarchy(treeData, function(d) {
          return d.children;
      });

      // maps the node data to the tree layout
      nodes = treemap(nodes);


      // adds the links between the nodes
      var link = g.selectAll(".link")
          .data(nodes.descendants().slice(1))
          .enter().append("path")
          .attr("class", "link")
          .style("stroke", function(d) {
            console.log(d.data)
            if (d.data.completed) return color[d.data.type]
              else return "white";
          })
          .attr('stroke-width',function(d){
            return 20*1/(d.depth + 1)
          })
          .attr("d", function(d) {
              return "M" + d.y + "," + d.x +
                  "C" + (d.y + d.parent.y) / 2 + "," + d.x +
                  " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
                  " " + d.parent.y + "," + d.parent.x;
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
              return "translate(" + d.y + "," + d.x + ")";
          });

      // adds the circle to the node
      node.append("circle")
          .attr("r", function(d) {
            // console.log(d)
              if (d.data.type == "root") return 50
              else return  30*1/(d.depth + 1);
          })
          .style("stroke", function(d) {
              return color[d.data.type];
          })
          .style("fill", function(d) {
            if (d.data.type == "root") return 'url(#gradient)'
            else return (d.data.completed) ? color[d.data.type] : '#eee';
          })
          .style('stroke-width',function(d){
            if (d.data.type == "root") return 1
            else return 5
          })
          .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);

            if (d.data.type != "root"){
              var html = "<p class = 'title'>" +d.data.name +"</p><p>Status: "
              html += (d.data.completed)? "Completed": "Incomplete";
              html += "</p>"
              if (d.data.time){
                var date = d.data.time.split('T')[0]
                var time = d.data.time.split('T')[1];
                time = time.split('.')[0]
                date = date.split('-')
                date = date[1]+"-"+date[2] +": " + time
                // console.log(date)
              // Apply each element to the Date function
              // var date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
              html +=' <p>'+date+'</p>'
              }
            }else {
              var html = "<p class = 'title'>Tasks Completed: </p>"
              for (task in d.data.tasksList){
                html+= "<p>"+(task+1)+". "+d.data.tasksList[task].name+"</p>"
              }
            }


            div	.html(
              html
            )
                .style("left", (d3.event.pageX)+20 + "px")
                .style("top", (d3.event.pageY) +20 + "px")
                .style('background',color[d.data.type])
                .style("color", function() {
                  console.log(d.data.type)
                  if (d.data.type == "section"||d.data.type == "chapter") return '#000'
                    else return "#fff"
                })
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

      // adds the text to the node
      node.append("text")
          .attr("dy", function(d){

            return (d.data.type == "root")? 70:".35em"
          })
          .attr("x", function(d) {
            if (d.data.type == "root") return 0
            else  return d.children ?   -20: 10
          })
          .style("text-anchor", function(d) {
            if (d.data.type == "root") return 'middle'
              else return d.children ? "end" : "start";
          })
          .text(function(d) {
            if (d.data.type == "root") return "Tasks Completed: "+ d.data.tasksList.length
              else return d.data.name;
          });


    }



})
