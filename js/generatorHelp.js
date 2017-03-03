d3 = require('d3')

module.exports.expScale = function expScale(a,b,c,exp,round){
  var out = d3.scaleLinear()
    .domain([0, c])
    .range([a, b])
    .clamp(true)
  if (round) return Math.round(out(exp))
  else return out(exp);
}
