var Chance = require('chance')
var chance = new Chance();
var _ = require('underscore');



module.exports.test = function(x){
  var table = [
    {"name": "Eve",   "parent": ""},
    {"name": "Cain",  "parent": "Eve"},
    {"name": "Seth",  "parent": "Eve"},
    {"name": "Enos",  "parent": "Seth"},
    {"name": "Noam",  "parent": "Seth"},
    {"name": "Abel",  "parent": "Eve"},
    {"name": "Awan",  "parent": "Eve"},
    {"name": "Enoch", "parent": "Awan"},
    {"name": "Azura", "parent": "Eve"}
  ]


    return table
}
