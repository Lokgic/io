$(function(){
  $bar = $('#mainnavbar')
    NavScrollTop = 0
    diff = 0
  $(window).on('scroll',function(){
      if ($(window).scrollTop() == 0){
        $bar.fadeIn();
      } else if (diff > 70){
        $bar.fadeOut();
        NavScrollTop = $(window).scrollTop()
        diff = 0
      } else if (diff < -20){
        $bar.fadeIn();
        NavScrollTop = $(window).scrollTop()
        diff = 0
      } else if ($(window).scrollTop() != NavScrollTop){
        diff = $(window).scrollTop() - NavScrollTop
      }

    })
    // $sl = $('#slmenu')
    // function makelink(url,title){
    //   return "<a class = 'dropdown-item' href=" +url+">" + title +"</a>"
    // }
    // $.getJSON("/json/content.json",function(data){
    //   for (chapter in data.sl){
    //     // $sl.append(makelink(data.sl[chapter].url,data.sl[chapter].title))
    //   }
    // })
  })
