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
    .domain(topNameCounts)
    .rangeBands([0, graphWidth], bandPadding);

  var yScale = d3.scale.linear()
    .domain([0, maxNameCount])
    .range([0, graphHeight]);

  function translator(d, i) {
    return "translate(" + (bands.range()[i]* 1.02) + "," +
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

  var yAxisScale = d3.scale.linear()
    .domain([maxNameCount, 0])
    .range([0, graphHeight]);

  var leftAxis = d3.svg.axis()
    .orient('left')
    .scale(yAxisScale);

  var leftAxisNodes = leftAxisGroup.call(leftAxis);
  styleAxisNodes(leftAxisNodes);

  var bottomAxisScale = d3.scale.ordinal()
    .domain(topNames)
    .rangeBands([axisPadding, graphWidth + axisPadding]);

  var bottomAxis = d3.svg
    .axis()
    .scale(bottomAxisScale)
    .orient("bottom");

  var bottomAxisX = margin.left - axisPadding;
  var bottomAxisY = totalHeight - margin.bottom + axisPadding;
  var bottomAxisGroup = svg.append("g")
    .attr({
      transform: 'translate(' + bottomAxisX + ',' + bottomAxisY +
        ')'
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
