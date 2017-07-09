// globals
var sampleLimit = 20;
var margin = {
  top: screen.availHeight * 0.1,
  right: screen.availWidth * 0.2,
  bottom: screen.availHeight * 0.3,
  left: screen.availWidth * 0.2
};
var graphWidth = screen.availWidth * 0.6;
var graphHeight = screen.availHeight * 0.6;
var totalWidth = graphWidth + margin.left + margin.right;
var totalHeight = graphHeight + margin.top + margin.bottom;
var axisPadding = 5;
var bandPadding = 0.5;

function styleAxisNodes(axisNodes) {
  axisNodes.selectAll('.domain')
    .attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
    });
  axisNodes.selectAll('.tick line')
    .attr({
      fill: 'none',
      'stroke-width': 1,
      stroke: 'black'
    });
}


d3.csv('baby_names_data/yob1880.csv', function(data) {

  //============== get most popular names, counts & max count ==============//
  var topNameCounts = data
    .filter(function(d, i) {
      if (d.GENDER === "F" && i < sampleLimit) {
        return d;
      }
    })
    .map(function(d) {
      return parseInt(d.COUNT);
    });

  var maxNameCount = d3.max(topNameCounts);

  var topNames = data
    .filter(function(d, i) {
      if (d.GENDER === "F" && i < sampleLimit) {
        return d;
      }
    })
    .map(function(d) {
      return d.NAME;
    });

  //============== create <svg> and <g> elements ==============//
  var svg = d3.select('body')
    .append('svg')
    .attr({
      width: totalWidth,
      height: totalHeight
    });

  var mainGroup = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' +
      margin.top + ")");


  //============== create the bars ==============//
  var bands = d3.scale.ordinal()
    // sets the input domain of this scale to the array of values passed in (so
    // e.g. the first element in the array parameter will be mapped to the first
    // element in the range, etc.)
    .domain(topNameCounts)
    // below, first param is min & max value of interval, which is divided into "n"
    // equal bands, where "n" is the number of data; bandPadding is (between 0 and 1)
    // the amount of each band which should be devoted to padding
    .rangeBands([0, graphWidth], bandPadding);

  var yScale = d3.scale.linear()
    // top is is 0; bottom is the maxNameCount
        // @QUESTION: why not the minNameCount?
    .domain([0, maxNameCount])
    // top is 0; bottom is graphHeight
    .range([0, graphHeight]);

  function translator(d, i) {
    // 1.02 below is a magic number chosen by trial and error, to keep the
    // axis ticks as [aligned to the vertical bars] as possible.
    return "translate(" + (bands.range()[i] * 1.02) + "," +
      (graphHeight - yScale(d)) + ")";
  }

  var barGroup = mainGroup.selectAll('g')
    .data(topNameCounts)
    .enter()
    .append('g')
    .attr('transform', translator);

  barGroup.append('rect')
    .attr({
      fill: 'steelblue',
      width: bands.rangeBand(),
      height: function(d) {
        return yScale(d);
      }
    });

  barGroup.append('text')
    .text(function(d) {
      return d;
    })
    .style('text-anchor', 'start')
    .attr({
      dx: 10,
      dy: -5,
      transform: 'rotate(90)',
      fill: 'white'
    });

  //============== create the axes ==============//
  var leftAxisGroup = svg.append('g');
  leftAxisGroup.attr({
    transform: 'translate(' + (margin.left - axisPadding) + ',' + margin.top + ')'
  });

  // cool: here, using different scale for [y-values of bars] vs [y-values of axis]
  var yAxisScale = d3.scale.linear()
    // makes scale descend from highest value at top to lowest at bottom
    .domain([maxNameCount, 0])
    .range([0, graphHeight]);

  var leftAxis = d3.svg.axis()
    .orient('left')
    .scale(yAxisScale);

  var leftAxisNodes = leftAxisGroup.call(leftAxis);
  styleAxisNodes(leftAxisNodes);

  var bottomAxisScale = d3.scale.ordinal()
    // see 'var bands', above
    .domain(topNames)
    // array param offsets the left axis slightly to the right
    .rangeBands([axisPadding, graphWidth + axisPadding]);

  var bottomAxis = d3.svg.axis()
    .scale(bottomAxisScale)
    .orient("bottom");

  var bottomAxisX = margin.left - axisPadding;
  var bottomAxisY = totalHeight - margin.bottom + axisPadding;
  var bottomAxisGroup = svg.append("g")
    .attr({
      transform: 'translate(' + bottomAxisX + ',' + bottomAxisY + ')'
    });

  var bottomAxisNodes = bottomAxisGroup.call(bottomAxis);
  styleAxisNodes(bottomAxisNodes);

  bottomAxisNodes.selectAll("text")
    .style('text-anchor', 'end')
    .attr({
      dx: 0,
      dy: 10,
      transform: 'rotate(-60)'
    });

}); //end d3.csv
