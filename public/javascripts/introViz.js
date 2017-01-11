$(function(){

  var data = [
	{"lname": "Carnap", "fname": "Rudolf", "source": "The Unity of Science",
	"quote": 'Logic is the last scientific ingredient of Philosophy; its extraction leaves behind only a confusion of non-scientific, pseudo problems.'},

	// {"lname": "Frege", "fname": "Gottlob", "source": "Begriffsschrift",
	// "quote": "If the task of philosophy is to break the domination of words over the human mind... then my concept notation, being developed for these purposes, can be a useful instrument for philosophers... I believe the cause of logic has been advanced already by the invention of this concept notation."},

	{"lname": "Wittgenstein", "fname": "Ludwig", "source": "Tractatus Logico-Philosophicus",
	"quote": "The object of philosophy is the logical clarification of thoughts."},
	{"lname": "Wittgenstein", "fname": "Ludwig", "source": "Tractatus Logico-Philosophicus",
	"quote": "Logic is not a body of doctrine, but a reflection of the world. Logic is transcendental."}


	]
	var $jimbo = $('#jimbo');
	var $author = $('#author');
	var $quote = $('#quote');

	var seed = Math.floor(Math.random()* data.length) // get a random number f
	var quote = data[seed].quote.split(" ");

	for (var i = 0; i<quote.length; i++){
		if (quote[i].toLowerCase() == "logic"|| quote[i].toLowerCase() == "logic,"){
			quote[i] = '<h1 class="display-2">LOGIC</h1>';
			break;
		} else if (quote[i].toLowerCase() == "logical"){
			quote[i] = '<h1 class="display-2">LOGICAL</h1>';
			break;
		} else if (quote[i].toLowerCase() == "logic."){
			quote[i] = '<h1 class="display-2">LOGIC.</h1>';
			break;
		}
	}

	var recontructedQuote ="";
	for (var i = 0; i<quote.length; i++){
		recontructedQuote += quote[i] + " ";
	}

	var source = '<footer class="blockquote-footer">' + data[seed].fname + " " + data[seed].lname + " in " + '<cite title="'+data[seed].source +'">'+ data[seed].source + '</cite></footer>';
	// if (Math.floor(Math.random()* 2)){
	// 	$quote.addClass('blockquote-reverse');
	// }
	$quote.html(recontructedQuote + source);


	var seed2 = Math.floor(Math.random()* data.length)

	$('#moduleIntroQuote').html(data[seed2].quote);
	$('#moduleIntroAuthor').html(data[seed2].fname + " " + data[seed2].lname);

  new Svg_MathJax().install();
  function setDimensions(){
    dimensions=d3.select('.introAni').node().getBoundingClientRect()
  }
  var svg = d3.select(".introAni").append("svg")
  var scope = d3.select('.introAni')
  var dimensions;
  function setDimensions(){
    dimensions=d3.select('.introAni').node().getBoundingClientRect()
    svg.attr("width", dimensions.width)
    .attr("height", '100vh')
    // console.log(dimensions)
  }

  function togglePosition(d3Object,top, left){

      d3Object.style('position','fixed')
              .style('top',top)
              .style('left',left)

  }


  function midpoint(id){
    return $(id).offset().top + ($(id).height()/2) - (window.innerHeight/2)
  }
  setDimensions();
  var originalPos = dimensions.top/3


  togglePosition(scope, originalPos, dimensions.left)



  var treeData =

  {
    "name":"$Pb$",
    "children":[
      {"name":"$\\forall x \\forall y ((Px \\wedge Py) \\to x = y)$",
      "children":[
        {
          "name":"$\\neg \\forall x (x = b \\leftrightarrow Px)$",
          "children":[
            {
              "name":"$\\exists x \\neg (x = b \\leftrightarrow Px)$",
              "children":[
                {
                  "name": "$\\neg (c = b \\leftrightarrow Pc)$",
                  "children":[
                    {
                      "name":"$c=b$",
                      "children":[
                        {"name":"$\\neg Pc$",
                        "children":[
                          {"name":"$\\neg Pb$"}
                        ]
                      }
                      ]
                    }
                  ]
                },
                {
                  "name":"$\\neg c = b$",
                  "children":[
                    {"name":"$Pc$",
                    "children":[
                      {"name":"$\\forall y ((Pc \\wedge Py)\\to c = y)$",
                      "children":[
                        {"name":"$(Pc \\wedge Pb)\\to c = b$",
                        "children":[
                          {"name":"$\\neg (Pc \\wedge Pb)$",
                          "children":[
                            {"name":"$\\neg Pc$"},
                            {"name":"$\\neg Pb$"}
                          ]},
                          {"name": "$c=b$"}
                        ]}
                      ]}
                    ]}
                  ]
                }
              ]
            }
          ]
        }
      ]
      }
    ]
  }


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

          var A1YScale = d3.scaleLinear()
                           .domain([200,midpoint('#slide1')])
                           .range([originalPos,10])
                           .clamp(true)

          function minMaxScale(start,end){
            var output= d3.scaleLinear()
                  .domain([start,end])
                  .range([0,1])
                  .clamp(true)
                return output(scrollTop)
          }

          function A1Graphic(){
            togglePosition(scope, A1YScale(scrollTop), dimensions.left)
            //
            d3.selectAll('.set1').style('stroke-opacity',minMaxScale(midpoint("#slide1"),midpoint("#slide2")))
            d3.selectAll('.ngroup0 g').style('opacity',minMaxScale(0,midpoint("#slide1")))
            d3.selectAll('.ngroup1').style('opacity',minMaxScale(midpoint("#slide1"),midpoint("#slide2")))
            d3.selectAll('.set2').style('stroke-opacity',minMaxScale(midpoint("#slide2"),midpoint("#slide3")))
            d3.selectAll('.set3').style('stroke-opacity',minMaxScale(midpoint("#slide2"),midpoint("#slide3")))
            d3.selectAll('.ngroup2').style('opacity',minMaxScale(midpoint("#slide2"),midpoint("#slide3")))

          }

          scrollTop = 0
          newScrollTop = 0
          $(window).on('scroll',function(){
              newScrollTop = $(window).scrollTop()

            })

          var render = function() {


          // Don't re-render if scroll didn't change
          if (scrollTop !== newScrollTop) {

            // console.log(newScrollTop)




            // Graphics Code Goes Here
            scrollTop = newScrollTop;
            A1Graphic()



          }
          window.requestAnimationFrame(render)
        }

          window.requestAnimationFrame(render)
          // window.onresize = resize


})
