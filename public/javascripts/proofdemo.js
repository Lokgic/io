$(function () {

  var current = 'line1';
  var pos = 0;
	var seq = ['line1','line2','line6'];
  for (var i = 2;i<11;i++){
    $('#line'+i).addClass('invisible');
  }
  //  for (var i = 2;i<5;i++){
  //   $('#scope'+i).addClass('invisible');
  // }
  // $('[data-toggle='tooltip']').tooltip()
  // $('[data-toggle='popover']').popover('hide');

  $('#'+current).popover('show');
  // $('#2').popover('show');

  $('#forward').on('click', function(){
  	$('#'+ current).popover('hide');
  	pos++;
    current = seq[pos];
 	$('#'+current).removeClass('invisible');
    $('#'+current).popover('show');
  })


  function sequencer(task){


  }

})
