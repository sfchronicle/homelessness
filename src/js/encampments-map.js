
// load our custom elements
require("component-leaflet-map");
var d3 = require('d3');

// use this color code instead
var encampment_color = "#79b675";
var waste_color = "#dfb372";
var needle_color = "#539ecd";

// color code
var red = "#EB5773";
var yellow = "#f9ac06";
var blue = "#3068e0"

// get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;


// Disable drag and zoom handlers.
// map.dragging.disable();
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.keyboard.disable();
map.options.minZoom = 11;
map.options.maxZoom = 17;

if (screen.width <= 480) {
  //console.log("phone screen");
  map.setView(new L.LatLng(37.75, -122.43), 11);
} else {
  map.setView(new L.LatLng(37.77, -122.44), 13);
}

/* Initialize the SVG layer */
L.svg().addTo(map);
// map._initPathRoot();


var svgMap = d3.select("#complaints-map").select("svg");
var g = svgMap.append("g");

// var allMapData = require('../encampments-map-2017/alldata311.json');

/* Add a LatLng object to each item in each of the datasets */

// var fullDataSet = [];

window.onload = function(){
  for (i = 1; i < 7; i++) {
    d3.csv("http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_201"+i.toString()+".csv", function(data){
    // d3.csv("./assets/encampments-311-data/data_311_201"+i.toString()+".csv", function(data){

    	// var data = eval("data201" + i.toString());
    	data.forEach(function(d) {
        // console.log(d);
        
        d.LatLng = new L.LatLng(d.Latitude,
          d.Longitude);

      });

      //setTimeout(() => drawData(data), 1000);
      // var fullDataSet = [];
      // fullDataSet.push.apply(fullDataSet, data);
      // console.log(fullDataSet);
      // setTimeout(() => drawData(fullDataSet), 500);
      // setInterval(drawData(data), 100);
      drawData(data);
      //drawData(fullDataSet);
      // console.log(feature);
    });
  }

};


function drawData(data){
  // prints the correct number of the size of the data, by year
  console.log(data.length);

  // somewhere between above and below, data goes wonky???
  var feature = g.selectAll("circle")
  .data(data)
  .enter().append("circle")
  .attr("class", function (d) {
    var twoclass = d.CategoryID + " " + "year" + d.YearOpened;
        // console.log(d.YearOpened);
        return twoclass;
  })
  .style("opacity", function (d) {
    if (d.YearOpened == 2011) {
      // console.log("2011");
      return 0.4;
    } else {
      // console.log(d.YearOpened);
      return 0;
    }
  })
  .style("fill", function (d) {
    if (d.CategoryID == "encampment") {
      // console.log("got encampment");
      return encampment_color;
    } else if (d.CategoryID == "waste") {
  		// console.log("got waste");
  		return waste_color;
  	} else {
  		return needle_color;
  	}
  })
  .attr("r", 2)
  .attr("transform", function(d) {
    return "translate("+
    (map.latLngToLayerPoint(d.LatLng).x) +","+
    map.latLngToLayerPoint(d.LatLng).y +")";
  });

  checkForToggle();

}




function checkForToggle () {
  var toggles = document.querySelectorAll('.toggle');
  // console.log(toggles);
  for (var i = 0; i < toggles.length; i++) {
    var pointClass = '.'+toggles[i].id;
    // console.log(pointClass);

    if (toggles[i].checked) {
      // console.log(toggles[i]);
      d3.selectAll(pointClass).attr('visibility', 'visible');
    } else {
      d3.selectAll(pointClass).attr('visibility', 'hidden');

    }
  }
};


// what is going on here????
function handleChange (e) {
  d3.selectAll("circle").style('opacity', 0);
  var option   = e.target.options[e.target.selectedIndex];    
  var classname = ".year" + option.value;
      // console.log(classname);
      // console.log(g.selectAll(classname).size());
      
  d3.selectAll(classname).style('opacity', 0.4);
  map.on("zoomend", update);
  update();
}

var yearSelect = document.querySelector('select');
yearSelect.addEventListener('change', handleChange, false);

function handleCommand (e) {
  var pointClass = '.'+e.target.id;
  //console.log(pointClass);
  if (e.target.checked) {
  // console.log(pointClass);
  // this works: console.log(d3.selectAll(pointClass).size());
    d3.selectAll(pointClass).attr('visibility', 'visible');
  } else {
    d3.selectAll(pointClass).attr('visibility', 'hidden');
  }
  checkForToggle();
}

var nodes = document.querySelectorAll('.toggle');
for (var i = 0; i < nodes.length; i++) {
  nodes[i].addEventListener('click', handleCommand, false);
}

map.on("zoomend", update);
update();

function update() {
  d3.selectAll("circle")
  .filter(function(d) {
    return d3.select(this).style('opacity') == 0.4;
  })
  .attr("transform", function(d) {
    // console.log(d);
    return "translate("+
    map.latLngToLayerPoint(d.LatLng).x +","+
    map.latLngToLayerPoint(d.LatLng).y +")";
  })
}

// show tooltip
// var tooltip = d3.select("div.tooltip-srosmap");
