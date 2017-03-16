var Chance = require('chance')
var chance = new Chance();

var data = {
  constant: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i','j','k','l', 'm', 'n', 'o', 'p','q', 'r', 's', 't']
}
var catArg = {
    "state": {
        full: true,
        territories: false
    },
    "country": {
        full: true
    },
    "street": {
        short_suffix: true,
        country:"us"
    }
}

var objectCategory = ["first", "country", "last","state","constant"]

module.exports = function generateUD(n,choice) {


    if (choice != "constant") return chance.unique(chance[choice], n, catArg[choice])
    // console.log(data[choice])
    return chance.pickset(data[choice],n)
}
