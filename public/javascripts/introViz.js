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

        function togglePosition(d3Object,top, left){

            d3Object.style('position','fixed')
                    .style('top',top)
                    .style('left',left)

        }


        function midpoint(id){
          return $(id).offset().top + ($(id).height()/2) - (window.innerHeight/2)
        }
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

        function fixLocation(d3Object,l){
          d3Object.style('position','absolute')
                  .style('top',l.top)

        }

        function A1Graphic(){
          if (scrollTop < midpoint('#slide3')){
            togglePosition(scope, A1YScale(scrollTop), dimensions.left)
          } else {
              d=$('#slide3').offset()
              fixLocation(scope,d)
          }

          //
          d3.selectAll('.set1').style('stroke-opacity',minMaxScale(midpoint("#slide1"),midpoint("#slide2")))
          d3.selectAll('.ngroup0 g').style('opacity',minMaxScale(0,midpoint("#slide1")))
          d3.selectAll('.ngroup1').style('opacity',minMaxScale(midpoint("#slide1"),midpoint("#slide2")))
          d3.selectAll('.set2').style('stroke-opacity',minMaxScale(midpoint("#slide2"),midpoint("#slide3")))
          d3.selectAll('.set3').style('stroke-opacity',minMaxScale(midpoint("#slide2"),midpoint("#slide3")))
          d3.selectAll('.ngroup2').style('opacity',minMaxScale(midpoint("#slide2"),midpoint("#slide3")))

        }



        function A2Graphic(){
          if (scrollTop < midpoint('#slide4')){
            var location=$('#slide4').offset()
            fixLocation(d3.select('#section2 .introAni'),location)


          } else {
              togglePosition(d3.select('#section2 .introAni'), 0, 0)
          }

          if (scrollTop > midpoint('#slide4') + window.innerHeight/2){
            click(section2Svg,partition(root).descendants()[1])
          } else if (scrollTop < midpoint('#slide4') + window.innerHeight/2){
            click(section2Svg,partition(root).descendants()[0])
          }

        }

      function makeProof(){

        var proof = [
          "$\\exists z Gz$", "$\\forall y (Gy \\to Hc)$", "Gb", "Gb \\to Hc", "\\exists Hc", "\\exists x Hx","\\exists x Hx"
        ]

        var width = $('#section2 .introAni').width(),
                height = window.innerHeight,
                yM = window.innerHeight/8,
                xM = window.innerWidth/13;

        var base = d3.select('#section2 .introAni')
              .append('svg')
              .attr('width', width )
              .attr('height', height)
        var xSpacing = 120
        var ySpacing = 50
        var scopeStart = 'M '+xM +' '+yM
        var scope = []
         base.append('g').append('path').attr('d',scopeStart + " V "+(height -yM)).style('stroke','grey').style('stroke-width', 3)


        // scope[1] = scopeline.append('path').attr('d','M '+xM +' '+(yM +ySpacing)+ " m " + xSpacing +" 0 V "+(height -yM)).style('stroke','grey').style('stroke-width', 3)

        base.append('text').text('$Fx \\to Gx$').attr('x',xM+xSpacing).attr('y',yM+ySpacing).attr('font-size','25').style('opacity',1)

        var x = xM+xSpacing
        var y = yM+ySpacing + 20
        base.append('path').attr('d',"M "+ x  + " " + y+ " V "+(height -yM)).style('stroke','grey').style('stroke-width', 3)


        base.append('text').text(proof[1]).attr('x',xM+xSpacing+100).attr('y',yM+ySpacing+100).attr('font-size','25').style('opacity',1)


        }


        // makeProof()
        wheelInit()
        function wheelInit(){

              // navInfo = d3.select('#section2 .introAni')
              completeColor = "#444C5C"
              var readinEx = 1;
              var logicize = 2;
              var ass = 6;
              var test = 7
              var pa = 3
              root = {
                  "name": "profile",
                  "children": [

                      {
                          "name": "Sentence Logic",
                          "children": [{
                                  "name": "Reading Exercise",
                                  'children': [{
                                      "name": "Introduction: Validity and Venn Diagrams",
                                      "children": [{
                                          "name": 'Logic as the systemtic evaluation of arguments',
                                          "size": readinEx,
                                          "status": "incomplete"
                                      }, {
                                          "name": 'Euler and Venn Diagrams',
                                          "size": readinEx
                                      }, {
                                          "name": "Aristotelian logic and categorical statements",
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "Concepts of Deductive Logic",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "Symbolization",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "Truth Trees (Semantic Tableaux)",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }]
                              }, {
                                  "name": "logicize",
                                  "children": [{
                                      "name": "Venn Diagram and Syllogistic Validity",
                                      "size": logicize
                                  }, {
                                      "name": "Wason Selection Task",
                                      "size": logicize
                                  }, {
                                      "name": "Puzzles",
                                      "size": logicize
                                  }, {
                                      "name": "Using Truth Trees",
                                      "size": logicize
                                  }]
                              }, {
                                  "name": "assignment",
                                  "children": [{
                                          "name": "incomplete",
                                          "size": ass
                                      }

                                  ]
                              }, {
                                  "name": "test",
                                  "children": [{
                                          "name": "not passed",
                                          "size": test
                                      }

                                  ]
                              }

                          ]
                      }, {
                          "name": "Predicate Logic",
                          "children": [{
                                  "name": "reading",
                                  "children": [{
                                          "name": "Introduction to Predicate Logic and its Syntax",
                                          "children:": [{
                                                  "name": 'section1',
                                                  "size": readinEx
                                              }, {
                                                  "name": 'section2',
                                                  "size": readinEx
                                              }

                                          ]
                                      }, {
                                          "name": "Quantifiers",
                                          "children": [{
                                              "name": 'section1',
                                              "size": readinEx
                                          }, {
                                              "name": 'section2',
                                              "size": readinEx
                                          }]
                                      }, {
                                          "name": "Semantics and Models",
                                          "children": [{
                                              "name": 'section1',
                                              "size": readinEx
                                          }, {
                                              "name": 'section2',
                                              "size": readinEx
                                          }]
                                      }, {
                                          "name": "Truth Trees for Predicate Logic",
                                          "children": [{
                                              "name": 'section1',
                                              "size": readinEx
                                          }, {
                                              "name": 'section2',
                                              "size": readinEx
                                          }]
                                      }

                                  ]
                              }, {
                                  "name": "logicize",
                                  "children": [{
                                      "name": "Logical puzzles with quantities",
                                      "size": logicize
                                  }, {
                                      "name": "Model Interpretation",
                                      "size": logicize
                                  }]
                              }, {
                                  "name": "assignment",
                                  "children": [{
                                          "name": "incomplete",
                                          "size": ass
                                      }

                                  ]
                              }, {
                                  "name": "test",
                                  "children": [{
                                          "name": "not passed",
                                          "size": test
                                      }

                                  ]
                              }

                          ]
                      }, {
                          "name": "Natural Deduction",
                          "children": [{
                                  "name": "reading",
                                  "children": [{
                                      "name": "SL: Basic Rules of Inferences",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "SL: Hypothetical Rules of Inferences",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "SL: Derived Rules and Logical Laws",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "SL: Proofs",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "PL: Universal Elimination and Existential Introduction",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "PL: Universal Introduction and Existential Elimination",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "PL: Proofs",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }]
                              }, {
                                  "name": "logicize",
                                  "children": [{
                                      "name": "Proof Completion",
                                      "size": logicize
                                  }]
                              }, {
                                  "name": "assignment",
                                  "children": [{
                                          "name": "incomplete",
                                          "size": ass
                                      }

                                  ]
                              }, {
                                  "name": "test",
                                  "children": [{
                                          "name": "not passed",
                                          "size": test
                                      }

                                  ]
                              }

                          ]
                      }, {
                          "name": "Identity, Descriptions, and Functions",
                          "children": [{
                                  "name": "reading",
                                  "children": [{
                                      "name": "The Identity Symbol",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "Expressing Quantities in PL",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "Definite Descriptions",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "Quantities with Definite Descriptions",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "Identity: Model Semantics",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "Functions in PL",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }, {
                                      "name": "Proofs with Identity",
                                      "children": [{
                                          "name": 'section1',
                                          "size": readinEx
                                      }, {
                                          "name": 'section2',
                                          "size": readinEx
                                      }]
                                  }]
                              }, {
                                  "name": "logicize",
                                  "children": [{
                                      "name": "Grid",
                                      "size": logicize
                                  }, {
                                      "name": "Model Interpretation with Identity",
                                      "size": logicize
                                  }]
                              }, {
                                  "name": "assignment",
                                  "children": [{
                                          "name": "incomplete",
                                          "size": ass
                                      }

                                  ]
                              }, {
                                  "name": "test",
                                  "children": [{
                                          "name": "not passed",
                                          "size": test
                                      }

                                  ]
                              }

                          ]
                      }, {
                          "name": "Participatory",
                          "children": [{
                                  "name": "1",
                                  "children": [{
                                      "name": "incomplete",
                                      "size": pa
                                  }]
                              }, {
                                  "name": "2",
                                  "children": [{
                                      "name": "incomplete",
                                      "size": pa
                                  }]
                              }, {
                                  "name": "3",
                                  "children": [{
                                      "name": "incomplete",
                                      "size": pa
                                  }]
                              }, {
                                  "name": "4",
                                  "children": [{
                                      "name": "incomplete",
                                      "size": pa
                                  }]
                              }

                          ]
                      }


                  ]
              }



              var width = $('#section2 .introAni').width(),
                  height = $('#section2 .introAni').height()
                  radius = (Math.min(width, height) / 2) - 10;

              var formatNumber = d3.format(",d");

               x = d3.scaleLinear()
                  .range([0, 2 * Math.PI]);

               y = d3.scaleSqrt()
                  .range([0, radius]);

              var color = d3.scaleOrdinal(d3.schemeSet3);
              // var color2 = d3.scaleSequential(d3.interpolateBrBG)
              var slc = d3.scaleSequential(d3.interpolateBuPu)
              var plc = d3.scaleSequential(d3.interpolatePuRd)
              var ndc = d3.scaleSequential(d3.interpolateYlGnBu)
              var idc = d3.scaleSequential(d3.interpolateYlGn)
              var pc = d3.scaleSequential(d3.interpolateGreys)

              colS = {
                  "Sentence Logic": slc,
                  "Predicate Logic": plc,
                  "Natural Deduction": ndc,
                  "Identity, Descriptions, and Functions": idc,
                  "Participatory": pc
              }

              partition = d3.partition();

              arc = d3.arc()
                  .startAngle(function(d) {
                      return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
                  })
                  .endAngle(function(d) {
                      return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
                  })
                  .innerRadius(function(d) {
                      return Math.max(0, y(d.y0));
                  })
                  .outerRadius(function(d) {
                      return Math.max(0, y(d.y1));
                  });

              function findModule(d) {
                  if (d.parent.data.name == "profile") return d.data.name;
                  else return findModule(d.parent)
              }

              section2Svg = d3.select('#section2 .introAni').append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");


              root = d3.hierarchy(root);
              root.sum(function(d) {
                  return d.size;
              });
              section2Svg.selectAll("path")
                  .data(partition(root).descendants())
                  .enter().append("path")
                  .attr("d", arc)
                  .style("fill", function(d) {
                      // console.log(d)
                      if (d.data.name == "profile") return "white"
                      else if (d.data.status == "complete") return completeColor
                      else {
                          return colS[findModule(d)](1.6 / d.depth)
                      }
                  })
                  .style("stroke", function(d) {
                      return "#fff"
                  })
                  .style('stroke-width', '3')
                  .style("opacity", 0.7)
                  .on('click',function(d){console.log(d)})




              function getAncestors(node) {
                  var path = [];
                  var current = node;
                  while (current.parent) {
                      path.unshift(current);
                      current = current.parent;
                  }
                  return path;
              }


              function click(d) {
                  svg.transition()
                      .duration(750)
                      .tween("scale", function() {
                          var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                              yd = d3.interpolate(y.domain(), [d.y0, 1]),
                              yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                          return function(t) {
                              x.domain(xd(t));
                              y.domain(yd(t)).range(yr(t));
                          };
                      })
                      .selectAll("path")
                      .attrTween("d", function(d) {
                          return function() {
                              return arc(d);
                          };
                      });
              }

              d3.select(self.frameElement).style("height", height + "px");
        }
        function click(svg,d) {
          // console.log(root)
            svg.transition()
                .duration(750)
                .tween("scale", function() {
                    var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                        yd = d3.interpolate(y.domain(), [d.y0, 1]),
                        yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                    return function(t) {
                        x.domain(xd(t));
                        y.domain(yd(t)).range(yr(t));
                    };
                })
                .selectAll("path")
                .attrTween("d", function(d) {
                    return function() {
                        return arc(d);
                    };
                });
        }
        // wheelInit()





        scrollTop = 0
        newScrollTop = 0
        $(window).on('scroll',function(){
            newScrollTop = $(window).scrollTop()

          })

        var render = function() {


        // Don't re-render if scroll didn't change
        if (scrollTop !== newScrollTop) {

          console.log(newScrollTop)




          // Graphics Code Goes Here
          scrollTop = newScrollTop;
          A1Graphic()
          A2Graphic()


        }
        window.requestAnimationFrame(render)
      }

        window.requestAnimationFrame(render)
        // window.onresize = resize


})
