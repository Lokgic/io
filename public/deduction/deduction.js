$(function(){
  // var tooltipData
  // var tooltip = d3.select("body").append("div")
  //     .attr("class", "tooltip")
  // tooltip.style("right",  "10px")
  //       .style('position','fixed')
  //       .style("top", "90%")
  //       .text("Mouse over each tree node for further information.")


  $('#forward').notify("Press '>' or '<' to nagviate between the topics.",{
    "position":"bottom",
    "autoHide":true,
    "clickToHide":true,
    "style":"deduction"
  })
  function drawDeduction(div,lines,der){
      var area = d3.select(div)
      var der = area.append('h4').text(der).attr('class','derivation')


      var scope1 = area.append('div')
                        .attr('id','scope1')
                        .attr('class','scope')

      var currentScope = 1
      for (line in lines){
        var n = parseInt(line) + 1
        var text = (n) +". " + lines[line][1]
        if (lines[line][0] == currentScope + 1){
          newScope = 1 + currentScope;
          d3.select('#scope' + currentScope).append('div').attr('id', 'scope'+newScope).attr('class','scope')
          // $('#scope' + currentScope).append("<div id = scope" + newScope + " class = 'scope'></div")
          currentScope = newScope;
        } else if (lines[line][0] == currentScope - 1) currentScope -= 1;
          var classInfo,idInfo
          idInfo = n
          if (lines[line][3] == null) classInfo = "line HSable";
          else{
            classInfo = (lines[line][3].ass)? "ass HSable" :"line HSable";
            classInfo += (lines[line][3].hoverable)? " hoverable" :"";
          }


          var lineDiv = d3.select('#scope' + currentScope).append("div").attr('id',"line"+idInfo).attr('class',classInfo).text(text)
          lineDiv.append('div').attr('class','just').text(lines[line][2])
      }

      d3.selectAll('.hoverable')
        .on('mouseover',function(){
          var id = d3.select(this).attr('id')
          var dim = d3.select(div).node().getBoundingClientRect()

        })
  }

  var slideShow = function(slides){
    self = this
    this.backward = d3.select('#backward')
                        .on('click',function(){self.goBack()})
    this.forward = d3.select('#forward')
                    .on('click',function(){self.goForward()})
    this.max = slides.length - 1
    this.currentSlideNum = 0
    this.slides = slides
    this.makeCurrent();


  }

  slideShow.prototype.goForward = function(){
    if (this.currentSlideNum < this.max){
      this.currentSlideNum++;
      this.makeCurrent()
    }
  }

  slideShow.prototype.goBack = function(){
    if (this.currentSlideNum > 0){
      this.currentSlideNum--;
      this.makeCurrent()
    }
  }

  slideShow.prototype.makeCurrent = function(){
    if (this.currentSlide != null){
      this.currentSlide.classed('offScreen',true)
    }
    this.currentSlide = d3.select('#slide'+this.currentSlideNum).classed('offScreen',false)
    d3.select('.slideTitle').select('span').text(this.slides[this.currentSlideNum].title)
    if (this.currentSlideNum == this.max) this.forward.classed('offScreen',true)
    else if (this.currentSlideNum == 0) this.backward.classed('offScreen',true)
    if (this.currentSlideNum +1 <= this.max) this.forward.classed('offScreen',false)
    if (this.currentSlideNum - 1 >= 0)  this.backward.classed('offScreen',false)

  }

  hoverTracker = function(data){

    d3.selectAll('.hoverableWord').on('mouseover',function(){
      var id = d3.select(this).attr('hoverId')
      if (!data[id].focus){
        var text = "<div class = 'hoverContent'>"
        for (line in data[id].text){
          text += "<p>" + data[id].text[line] +"</p>"
        }
        text+="</div>"

        var pos = (data[id].location && data[id].location!= null && data[id].location!="")? data[id].location: "bottom center"
        console.log(pos)
        $(data[id].target)
        .notify(text,{
          "position":pos,
          "autoHide":false,
          "clickToHide":true,
          "style":"deduction"
        })
        mathJax.reload('.notifyjs-container')
      }else{
        d3.selectAll('.HSable').each(function(){
          if (!_.contains(data[id].target,d3.select(this).attr('id'))){
            d3.select(this).transition().duration(200).style('opacity',0.2)
          } else  d3.select(this).transition().duration(1000).style('background','lightblue')

        })

      }


    })
    .on('mouseout',function(d){
      $('.notifyjs-container').trigger('notify-hide')
      d3.selectAll('.HSable').transition().duration(200).style('opacity',1).style('background','white')
    })
  }

  $.getJSON("deduction.json", function(json) {
    // console.log(json.truthTrees); // this will show the info it in firebug console

    var title = d3.select('.exploTitle').attr('id')
    var data  = json[title]
    drawDeduction('.interaction',data.proof,data.derivation)
    console.log(data)
    var slideInit = new slideShow(data.slides)
    var hoverInit = new hoverTracker(data.hoverData)
    mathJax.reload()

  });

})
