var _ = require('underscore')
var Chance = require('chance')
var chance = new Chance();
var vowels = ['a','e','i','o','u'];
var consonants = ['b', 'h' ,'p', 'z', 'g'];
var number = [2,3,4,5,6,7,8,9]
var all = 'aeiou' + 'bhpzg' + 23456789
var id = "wason3"
var strings = {
  vowel:"a vowel",
  consonant:"a consonant",
  even: "an even number",
  odd:"an odd number"
}
var conditionalRule = function(){

  var letterPoss = ["vowel","consonant"]
  var numberPoss = ["even","odd"]
  var poss = {
    letter:letterPoss,
    number:numberPoss,
  }

  var draw = []
  draw[0] = chance.pickone(poss.letter)
  draw[1] = chance.pickone(poss.number)
  _.shuffle(draw)
  this.left = draw[0]
  this.right = draw[1]
  this.leftStr = strings[this.left]
  this.rightStr = strings[this.right]


}


conditionalRule.prototype.toString = function(){
var seed = chance.pickone([1, 2, 3, 4, 5, 6, 7, 8]);
          if (seed === 1) {
              return "if one side of the card is " + this.leftStr + ", then the other side must be " + this.rightStr;
          } else if (seed === 2) {
              return "one side of the card is " + this.leftStr + " only if the other side is " + this.rightStr;
          } else if (seed === 3) {
              return "a card cannot have " + this.leftStr + " on one side without having " + this.rightStr + " on another side";
          } else if (seed === 4) {
              return "one side of card is " + this.rightStr + " if it has " + this.leftStr + " on another side";
          } else if (seed === 5) {
              return "having " + this.rightStr + " on one side is a necessary condition for having " + this.leftStr + " on the other side";
          } else if (seed === 6) {
              return "having " + this.leftStr + " on one side is a sufficient condition for having " + this.rightStr + " on the other side";
          } else {
              return "having " + this.leftStr + " on one side implies that the other side is " + this.rightStr
          }
}




var Card = function(face, color){

	if(face == undefined){
		face = chance.string({length: 1, pool: all});
	} else if (face == "even"){
			face = chance.string({length: 1, pool: "2468"});
	} else if (face == "odd"){
			face = chance.string({length: 1, pool: "3579"});
	} else if (face == "vowel"){
			face = chance.string({length: 1, pool: "aeiou"});
	} else if (face == "consonant"){
			face = chance.string({length: 1, pool: "bhpzg"});
	}
	this.face = face;
	this.vowel = false;
	this.consonant = false;
	this.even = false;
	this.odd = false;
	if (color == undefined){
		if (chance.bool()){
			this.color = "red"
		} else{
			this.color ="blue"
	}}else {
		this.color = color;
	}

	if (isNaN(parseInt(face))){
		this.type = 'letter';
		if (vowels.indexOf(face)!=-1){
			this.vowel = true;

		} else {
			this.consonant = true;

		}
	} else {
		this.type = 'number';
		if (face%2 == 0){

			this.even = true;
		}else{

			this.odd = true;
		}
	}

}


var Model = function(n,rule){
	var weights = {
		odd: 1,
		even: 1,
		vowel: 1,
		consonant: 1,
	}

	this.domain = [];
	while (n>0){

			var temp = new Card(

				chance.weighted(["odd","even","vowel","consonant"], [weights.odd, weights.even,weights.vowel, weights.consonant]))



				this.domain.push(temp);
				n--;

	}

  var negation = {
    "vowel":"consonant",
    "consonant":"vowel",
    "even":"odd",
    "odd":"even",
    "blue":"red",
    "red":"blue"
  }

  for (card in this.domain){
    if (this.domain[card][rule.left]|| this.domain[card][negation[rule.right]]){
      this.domain[card].answer = true;
    }else{
      this.domain[card].answer = false;
    }
  }
}

Model.prototype.interpret = function(rule){

}

test = new conditionalRule
console.log(test.toString())
console.log(m = new Model(10,test))
