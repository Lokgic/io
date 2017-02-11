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
  odd:"an odd number",
  bluevowel:"a blue vowel",
  redvowel:"a red vowel",
  blueconsonant: "a blue consonant",
  redconsonant: "a red consonant",
  blueeven: "a blue even number",
  redeven: "a red even number",
  blueodd: "a blue odd number",
  redodd: "a red odd number"

// for num too
}
var conditionalRule = function(colProb){
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
  this.leftCol = chance.bool({likelihood:colProb})? chance.pickone(["red","blue"]): null;
  this.rightCol = chance.bool({likelihood:colProb})? chance.pickone(["red","blue"]): null;
  console.log(this.rightCol)

  this.leftStr = (this.leftCol == null)?strings[this.left]: strings[this.leftCol+this.left]
  this.rightStr = (this.rightCol == null)?strings[this.right]: strings[this.rightCol+this.right]



  var seed = chance.pickone([1, 2, 3, 4, 5, 6, 7, 8]);
            if (seed === 1) {
                this.string =  "if one side of the card is " + this.leftStr + ", then the other side must be " + this.rightStr;
            } else if (seed === 2) {
                this.string = "one side of the card is " + this.leftStr + " only if the other side is " + this.rightStr;
            } else if (seed === 3) {
                this.string = "a card cannot have " + this.leftStr + " on one side without having " + this.rightStr + " on another side";
            } else if (seed === 4) {
                this.string = "one side of card is " + this.rightStr + " if it has " + this.leftStr + " on another side";
            } else if (seed === 5) {
                this.string = "having " + this.rightStr + " on one side is a necessary condition for having " + this.leftStr + " on the other side";
            } else if (seed === 6) {
                this.string = "having " + this.leftStr + " on one side is a sufficient condition for having " + this.rightStr + " on the other side";
            } else {
                this.string = "having " + this.leftStr + " on one side implies that the other side is " + this.rightStr
            }
}







var Card = function(face, color){
  this.selected = false;

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
    if (this.domain[card][rule.left]){
      if (rule.leftCol == null) this.domain[card].answer = true;
      else if (rule.leftCol == this.domain[card].color) this.domain[card].answer = true;
      else if (rule.leftCol != this.domain[card].color) this.domain[card].answer = false;


    }else if(this.domain[card][negation[rule.right]]){
       this.domain[card].answer = true;
    }else if (this.domain[card][rule.right]){
      if (rule.rightCol == null) this.domain[card].answer = false;
      else if (rule.rightCol == this.domain[card].color) this.domain[card].answer = false;
      else if (rule.rightCol != this.domain[card].color) this.domain[card].answer = true;
    }
    else{
      this.domain[card].answer = false;
    }
  }
}

Model.prototype.interpret = function(rule){

}



function wason1(parm){
  var settings
  var options = {
    1:{
      colorProbability: 0,
      numCards: chance.integer({min: 4, max: 8})
    },
    2:{
      colorProbability: 5,
      numCards: chance.integer({min: 6, max: 10})
    },
    3:{
      colorProbability: 40,
      numCards: chance.integer({min: 6, max: 10})
    },
    4:{
      colorProbability: 100,
      numCards: chance.integer({min: 12, max: 15})
    }
  }

  var colorProbability =

  settings = options[parm]
  var rule = new conditionalRule(settings.colorProbability)
  console.log(settings)
  var data ={
    model:new Model(settings.numCards, rule),
    rule:rule
  }
  return data

}
module.exports.wason1 = wason1
console.log(wason1(1).rule)
// test = new conditionalRule(70)

// console.log(test)
// console.log(test.toString())
// console.log(m = new Model(3,test))
