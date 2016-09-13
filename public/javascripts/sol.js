var mathJax = require('./mods/mathjax.js')
$(function(){
	var moduleNo = $("title").attr('id');
	var $body = $("#main");
	  function loadJSON(type, callback){
        $.getJSON('../json/' + type + moduleNo +'.json')
        .done(function(data){
        callback(null, data);
     }).fail(function(){console.log('Failed to Load Quiz')});

    }

     function printSolutions(type){

    	loadJSON(type, function(err, data){
    	var output = "";
     	if (type == "reading") output = prepareReadingHTML(data);
     		else if (type == "quiz")output=prepareQuizHTML(data);
     		else if (type =="concepts") output=prepareConceptsHTML(data);
     		$body.append(output);
    	})
    }



    function prepareReadingHTML(data){

    	var html = "<p class= 'display-4'> Reading </p>";
    	for (problem in data){

    		html += '<h3>'+data[problem].title+'</h3>';
    		html += '<p class = "lead">' + data[problem].instruction + '</p>';
    		for (var i = 0; i <data[problem].questions.length; i++){
    			html+= '<p class = "text-danger">Q: ' + data[problem].questions[i][0] + "</p>";
    			html+= '<p class = "text-primary">A: ' + data[problem].questions[i][1] + "</p>";
    		}

    	}
    	return html;

    }


       function prepareConceptsHTML(data){

    	var html = "<p class= 'display-4'> Concepts </p>";


    	 for (key in data){
    	 	html+= "<h3>" + key+'</h3>';
    	 	html += '<p class = "text-success">' + data[key].df + "</p>";
    	 }


    	return html;

    }


       function prepareQuizHTML(data){

    	var html = "<p class= 'display-4'> Quiz </p>";


    	 for (question in data){
            if(data[question].type == "mc"){
                 html+= "<h3>" + question +'</h3>';
                 if ("setup" in data[question]) html+= "Setup "+ data[question].setup;
                     html += '<p class ="lead text-primary">Q: ' + data[question].question + '</p>';
                     html += '<p class ="lead text-primary"> A: '+data[question].real + '</p>'
                 for (var i = 0; i <data[question].fake.length ; i++){
                      html += '<p class = "text-warning"> Fake Answer: '  + data[question].fake[i] + '</p>'
                         }
            }else if (data[question].type == "dropdown"){
                html+= "<h3>" + question +'</h3>';
                for (var i= 0;i<data[question].questions.length; i++){
                    html += '<p class ="lead text-info">Q: ' + data[question].questions[i][0] + '</p>';
                    html += '<p class ="lead text-primary">A: ' + data[question].questions[i][1] + '</p>';
                }

           }


       }

    	return html;

    }


    printSolutions("reading");
     printSolutions("concepts");
     printSolutions("quiz");

		 mathJax.load();

})
