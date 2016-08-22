$(function() {
	var $header = $('#readingheader');
	var $body = $('#readingblock')
	var moduleNo = $("title").attr('id');

	function getInfo(callback){
        $.getJSON('json/readinginfo.json') 
        .done(function(data){
        callback(null, data);
     }).fail(function(){$body.append('Failed to Load Quiz')});
      
    }

    function getTerms(callback){
        $.getJSON('json/readingquiz' + moduleNo +'.json')
        .done(function(data){
            callback(null, data)
        }).fail(function(){$body.append("Failed to Load Data.")})
    }

    getInfo(function(err, data){
        console.log()
    	$header.html("Module " + data[moduleNo - 1].header);
    	$body.html('<p>'+data[moduleNo - 1].description+'</p>');
    })

    getTerms(function(err, data){
        var terms = '<table class="table table-inverse table-hover table-bordered table-striped"><tbody>';
        var count = 0;
        for (key in data){
            if (count === 0){
                terms += '<tr>';
                
            } 
            terms += "<td> "+ data[key].term + '</td>';
            count++;
            if (count === 3){
                terms += '</tr>'
                count = 0;
            }

        }
        for (var i = 0; i < 3 - count; i++){
            terms+= '<td></td>'
            console.log(i);
        }
        terms += '</tbody>'
        $body.append('<p>For the reading quiz below, you are asked to select the definition of the term showned. All definitions are taken directly from the text.</p>' + terms);
       
        
    })

})