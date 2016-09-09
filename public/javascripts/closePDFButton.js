$(function(){
	var	$button = $('#closepdf');
	var $pdf = $('#right');
	var $row = $('#mainrow');
	var $leftCol = $('left');
	var saveHTML = $pdf;
	var open = true;
	$button.on('click', function(){
		if (open){
			$pdf.remove();
			open = false;
			$button.html('Toggle Text &larr;');
		} else{
			$row.append(saveHTML);
			open=true;
			$button.html('Toggle Text &rarr;');
		}
		})
})

