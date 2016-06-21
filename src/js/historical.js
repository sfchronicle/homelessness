var d3 = require('d3');

var square = 20;

var svg = d3.select(".waffle-chart").append("svg")
	.attr({
		width: 200,
		height: 200
	});

var svg2 = d3.select(".waffle-chart-2").append("svg")
	.attr({
		width: 200,
		height: 200
	});

// n = row, i = column

function createChart() {
	for (var n = 0; n < 10; n++) {
		var rows = svg.selectAll('rect' + ' .row-' + (n + 1))
		    .data(d3.range(10))
		    .enter().append('rect')
		    .attr({
		      id: function(d, i) {
				return 100 - (n*10) - (10-i) + 1;
		      },
		      width: square,
		      height: square,
		      x: function(d, i) {
		        return i * square;
		      },
		      y: n * square,
		      fill: '#d3d3d3',
		      stroke: '#fff'
		    });
	};
};

function createChart2() {
	for (var n = 0; n < 10; n++) {
		var rows = svg2.selectAll('rect' + ' .row-' + (n + 1))
		    .data(d3.range(10))
		    .enter().append('rect')
		    .attr({
		      id: function(d, i) {
				return 300 - (n*10) - (10-i) + 1;
		      },
		      width: square,
		      height: square,
		      x: function(d, i) {
		        return i * square;
		      },
		      y: n * square,
		      fill: '#d3d3d3',
		      stroke: '#fff'
		    });
	};
};

var years = ["2007-08","2008-09","2009-10","2010-11","2011-12","2012-13","2013-14","2014-15"];

var updateInfo = function(year) {
  document.querySelector(".info").innerHTML = `<strong>${year}</strong>`;
};

var fillChart = function() {
	for (var n = 0; n <= Math.round(waffleData[i].over_ten_percent); n++) {
		var value = n;
		console.log(value);
		var squareFill = document.getElementById(value);
		d3.select(squareFill).style("fill", "lightskyblue");
	};
};

var fillChart2 = function() {
	for (var n = 0; n <= Math.round(waffleData[i].over_sixty_percent); n++) {
		var value = n + 200;
		console.log(value);
		var squareFill = document.getElementById(value);
		d3.select(squareFill).style("fill", "#87df87");
	};
};

var resetChart = function() {
	d3.selectAll('rect').style("fill","#d3d3d3");
}

var i = 0;

var loop = null;
var tick = function() {
  fillChart(years[i]);
  fillChart2(years[i]);
  updateInfo(years[i]);

  if (i == (years.length - 1)) {
  	resetChart();
  }

  i = (i + 1) % years.length;
  loop = setTimeout(tick, i == 0 ? 1700 : 1700);
};

createChart();
createChart2();
tick();