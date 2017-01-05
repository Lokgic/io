$(function(){
    NavScrollTop = 0
  $(window).on('scroll',function(){
      NavNewScrollTop = $(window).scrollTop()
      if (NavNewScrollTop > NavScrollTop) $('#mainnavbar').fadeOut();
      else $('#mainnavbar').fadeIn();
      NavScrollTop = NavNewScrollTop;
    })
  })
