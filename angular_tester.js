var app = angular.module('chartApp', []);

app.controller('SalesController', ['$scope', function($scope) {
  $scope.salesData=[
      {hour: 1,sales: 54},
      {hour: 2,sales: 66},
      {hour: 3,sales: 77},
      {hour: 4,sales: 70},
      {hour: 5,sales: 60},
      {hour: 6,sales: 63},
      {hour: 7,sales: 55},
      {hour: 8,sales: 47},
      {hour: 9,sales: 55},
      {hour: 10,sales: 30}
  ];

  // $scope.namesData = d3.csv('baby_names_data/yob1880.csv', function(data) {
  //   console.log('here is $scope.namesData', data);
  // });

}]);

app.directive('barChart', function($window) {
  return {
    restrict: 'E',
    template: "<svg width='"+screen.availWidth * 0.6 +"' height='"+screen.availHeight * 0.6 +"'></svg>",
    link: function(scope, elem, attrs) {
      var salesDataToPlot = scope[attrs.chartData];
      var padding = 20;
      var pathClass = "path";
      var xScale, yScale, xAxisGen, yAxisGen, lineFun;

      var d3 = $window.d3;
      var rawSvg = elem.find('svg');
      var svg = d3.select(rawSvg[0]);

      function setChartParameters() {

        xScale = d3.scale.linear()
          .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length - 1].hour])
          .range([padding + 5, rawSvg.attr("width") - padding]);

        yScale = d3.scale.linear()
          .domain([0, d3.max(salesDataToPlot, function(d) {
            return d.sales;
          })])
          .range([rawSvg.attr("height") - padding, 0]);

        xAxisGen = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(salesDataToPlot.length - 1);

        yAxisGen = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .ticks(5);

        lineFun = d3.svg.line()
          .x(function(d) {
            return xScale(d.hour);
          })
          .y(function(d) {
            return yScale(d.sales);
          })
          .interpolate("basis");
      }

      function drawLineChart() {

        setChartParameters();

        svg.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0,180)")
          .call(xAxisGen);

        svg.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(20,0)")
          .call(yAxisGen);

        svg.append("svg:path")
          .attr({
            d: lineFun(salesDataToPlot),
            "stroke": "blue",
            "stroke-width": 2,
            "fill": "none",
            "class": pathClass
          });
      }

      drawLineChart();
    } //end link
  }; //end return
}); //end directive
