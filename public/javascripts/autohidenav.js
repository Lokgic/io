$(function(){
    NavScrollTop = 0
  $(window).on('scroll',function(){
      NavNewScrollTop = $(window).scrollTop()
      if (NavNewScrollTop > NavScrollTop) $('.navbar').fadeOut();
      else $('.navbar').fadeIn();
      NavScrollTop = NavNewScrollTop;
    })
  })
