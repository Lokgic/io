$(function() {
	var data = [
	{"lname": "Carnap", "fname": "Rudolf", "source": "The Unity of Science", 
	"quote": 'Logic is the last scientific ingredient of Philosophy; its extraction leaves behind only a confusion of non-scientific, pseudo problems.'},

	{"lname": "Frege", "fname": "Gottlob", "source": "Begriffsschrift", 
	"quote": "If the task of philosophy is to break the domination of words over the human mind... then my concept notation, being developed for these purposes, can be a useful instrument for philosophers... I believe the cause of logic has been advanced already by the invention of this concept notation."},
	
	{"lname": "Wittgenstein", "fname": "Ludwig", "source": "Tractatus Logico-Philosophicus", 
	"quote": "The object of philosophy is the logical clarification of thoughts."},
	{"lname": "Wittgenstein", "fname": "Ludwig", "source": "Tractatus Logico-Philosophicus", 
	"quote": "Logic is not a body of doctrine, but a reflection of the world. Logic is transcendental"},

	{"lname": "Tarski", "fname": "Alfred", "source": "Introduction to Logic and to the Methodology of Deductive Sciences",
	"quote": "Logic is justly considered the basis of all other sciences, even if only for the reason that in every argument we employ concepts taken from the field of logic, and that ever correct inference proceeds in accordance with its laws."},
	{"lname": "Russell", "fname":"Bertrand", "source":"Principle of Mathematics",
	"quote": "The fact that all mathematics is symbolic Logic is one of the greatest discoveries of our age; and when this fact has been established, the remainder of the principles of mathematics consists in the analysis of Symbolic Logic itself."},
	{"lname": "Peirce", "fname":"Charles Sander", "source": "Illustration of the Logic of Science",
	"quote": "Few persons care to study logic, because everybody conceives himself to be proficient enough in the art of reasoning already. But I observe that this satisfaction is limited to one's own ratiocination and does not extend to that of other men. We come to the full possession of our power of drawing inferences the last of all our faculties, for it is not so much a natural gift as a long and difficult art."},
	{"lname": "Carroll", "fname": "Lewis", "source": "Through the Looking-Glass",
	"quote": 'Contrariwise," continued Tweedledee, "if it was so, it might be; and if it were so, it would be; but as it isn\'t, it ain\'t. That\'s logic.'},
	{"lname": "Bierce", "fname": "Ambrose", "source": "The Unabridged Devil's Dictionary", "quote": "Logic, The art of thinking and reasoning in strict accordance with the limitations and incapacities of the human misunderstanding."}
	]
	var $jimbo = $('#jimbo');
	var $author = $('#author');
	var $quote = $('#quote');
	//var attrbeginning = "background: linear-gradient(0deg, #333E48, transparent ), linear-gradient(180deg, #333E48, transparent), radial-gradient(circle, transparent 10%, #787C7F 40%, #333E48 80%), rgba(17,67,85, .5) url(img/"
	//var attrending = ".png) no-repeat center"
	var seed = Math.floor(Math.random()* data.length) // get a random number f
	var quote = data[seed].quote.split(" ");

	for (var i = 0; i<quote.length; i++){
		if (quote[i].toLowerCase() == "logic"|| quote[i].toLowerCase() == "logic,"){
			quote[i] = '<h1 class="display-2">LOGIC</h1>';
			break;
		} else if (quote[i].toLowerCase() == "logical"){
			quote[i] = '<h1 class="display-2">LOGICAL</h1>';
			break;
		} else if (quote[i].toLowerCase() == "logic."){
			quote[i] = '<h1 class="display-2">LOGIC.</h1>';
			break;
		} 
	}

	var recontructedQuote ="";
	for (var i = 0; i<quote.length; i++){
		recontructedQuote += quote[i] + " ";
	}

	var source = '<footer class="blockquote-footer">' + data[seed].fname + " " + data[seed].lname + " in " + '<cite title="'+data[seed].source +'">'+ data[seed].source + '</cite></footer>';
	if (Math.floor(Math.random()* 2)){
		$quote.addClass('blockquote-reverse');
	}
	$quote.html(recontructedQuote + source);


	var seed2 = Math.floor(Math.random()* data.length)

	$('#moduleIntroQuote').html(data[seed2].quote);
	$('#moduleIntroAuthor').html(data[seed2].lname);
	// $jimbo.attr("style", attrbeginning + data[seed].lname.toLowerCase() + attrending);
	 // $author.html("- " + data[seed].fname + " " + data[seed].lname + ", <i>" +data[seed].source + "</i>");
	// $quote.html(data[seed].quote);
	//$author.html(source);

})

