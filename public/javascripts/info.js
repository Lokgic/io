$(function() {
	var $header = $('#readingheader');
	var $body = $('#readingblock')
	var CurrentModuleNo = $("title").attr('id');

	function printReadingInfo(callback){
        $.getJSON('../json/modulesinfo.json') 
        .done(function(data){
        callback(null, data);
     }).fail(function(){$body.append('Failed to Load Quiz')});
      
    }

    function printConceptsInfo(callback){
        $.getJSON('json/concepts' + CurrentModuleNo +'.json')
        .done(function(data){
            callback(null, data)
        }).fail(function(){$body.append("Failed to Load Data.")})
    }

    printReadingInfo(function(err, data){
        var $header = $('#readingheader');
        var $body = $('#readingblock')
    	$header.html(CurrentModuleNo + ": " + data[CurrentModuleNo].title);
    	$body.html('<p>'+data[CurrentModuleNo].description+'</p>');
        if (data[CurrentModuleNo].info.length != 0){
            for (index in data[CurrentModuleNo].info){
                $body.append('<h4>' + data[CurrentModuleNo].info[index][0] + '</h4>');
                $body.append('<p>' + data[CurrentModuleNo].info[index][1] + '</p>');
            }
        }
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.src  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
      document.getElementsByTagName("head")[0].appendChild(script);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,readingblock]);

    })

    printConceptsInfo(function(err, data){
        var $header = $('#conceptsheader');
        var $body = $('#conceptsblock')
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
        }
        terms += '</tbody>'
        $body.append('<p>For conceptual quiz, you will quizzed on the terms below. All definitions are taken directly from the text.</p>' + terms);
       
        
    })

})