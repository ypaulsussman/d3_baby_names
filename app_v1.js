// globals
var barWidth = 20;
var barPadding = 5;
var sampleLimit = 20;
var screenHeight = screen.height * 0.5;
var screenWidth = screen.width * 0.5;

// create svg element
var graph = d3.select("#graphWrapper")
  .append('svg')
  .attr({
    id: graph,
    height: screenHeight,
    width: screenWidth
  });

var popularityScale = d3.scale.linear()
                              .range([0, screenHeight]);

var popularityAxis = d3.svg.axis()
  .scale(popularityScale)
  .orient("right")
  .ticks(10);


d3.csv('baby_names_data/yob1880.csv', function(data) {

  var maxValue = d3.max(data, function(d, i) {
    if (d.GENDER === "F" && i < sampleLimit) {
      return parseInt(d.COUNT);
    }
  });

  var minValue = d3.min(data, function(d, i) {
    if (d.GENDER === "F" && i < sampleLimit) {
      return parseInt(d.COUNT);
    }
  });

  popularityScale.domain([parseInt(minValue), parseInt(maxValue)]);

  function xloc(d, i) {
    return i * (barWidth + barPadding);
  }

  function yloc(d) {
      return screenHeight - popularityScale(parseInt(d.COUNT));
  }

  function translator(d, i) {
    return "translate(" + xloc(d, i) + "," + yloc(d) + ")";
  }

  graph.append('g')
    .attr("class", "axis")
    .call(popularityAxis);

  bars = graph.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .filter(function(d, i) {
      return d.GENDER === "F" && i < sampleLimit;
    })
    .attr({
      fill: 'steelblue',
      transform: translator,
      width: 10,
      height: function(d) {
        return popularityScale(parseInt(d.COUNT));
      }
    });

}); //end d3.csv
