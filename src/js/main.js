// var $ = require("jquery");

//load our custom elements
require("component-leaflet-map");
// require("component-responsive-frame");
var d3 = require('d3');

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

// Disable drag and zoom handlers.
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.keyboard.disable();

map.setView(new L.LatLng(37.77, -122.41), 12);
map.scrollWheelZoom.disable();
// L.control.zoom("false");
// L.control.pan("false");

/* Initialize the SVG layer */
map._initPathRoot()

var looping = true;

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
g = svg.append("g");

/* Add a LatLng object to each item in the dataset */
callsData.forEach(function(d) {
		d.LatLng = new L.LatLng(d.Lat,
								d.Long)
});


// draw bubbles
var drawMap = function(selected_year) {

	d3.select("svg").selectAll("circle").remove();
	var svg = d3.select("#map").select("svg"),
	g = svg.append("g");

  // transition time
  var duration = 700;

	var yearData = callsData.filter(function(d) {
		return d.Year == selected_year
	});

	var feature = g.selectAll("circle")
		.data(yearData)
		.enter().append("circle")
		// .style("stroke", "black")
		.style("opacity", .2)
		.style("fill", "red")
		.attr("r", 3);

	map.on("viewreset", update);
	update();

	function update() {
		feature.attr("transform",
		function(d) {
			return "translate("+
				map.latLngToLayerPoint(d.LatLng).x +","+
				map.latLngToLayerPoint(d.LatLng).y +")";
			}
		)
	}

}

// drawMap("2015");


var years = [2013,2014,2015,2016];
var i = 0;

var loop = null;
var tick = function() {
  drawMap(years[i]);
  i = (i + 1) % years.length;
	console.log(i);
  loop = setTimeout(tick, i == 0 ? 1700 : 1000);
};

tick();
