$(function(){
	
	var $p1 = $('#popover1');
	$('[data-toggle="popover"]').popover()

	$p1.prepend('<a tabindex="0" role="button" data-toggle="popover" data-placement="bottom" data-trigger="focus" title="Dismissible popover" data-content="Test" id = "testpop">');
	$p1.append('<a>');
	$('#testpop').popover('show');

	$('body').click(function(){
  $('#testpop').popover('hide');
});
})

