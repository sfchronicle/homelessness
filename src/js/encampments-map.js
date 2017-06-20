
// load our custom elements
require("component-leaflet-map");
var d3 = require('d3');

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
map.minZoom = 10;

if (screen.width <= 480) {
  map.setView(new L.LatLng(37.75, -122.43), 11);
} else {
  map.setView(new L.LatLng(37.77, -122.44), 13);
}

/* Initialize the SVG layer */
L.svg().addTo(map);



var svgMap = d3.select("#complaints-map").select("svg");
var g = svgMap.append("g");

// var allMapData = require('../encampments-map-2017/alldata311.json');

/* Add a LatLng object to each item in each of the datasets */
for (i = 1; i < 7; i++) {
	var data = eval("data201" + i.toString());
	data.forEach(function(d) {
		d.LatLng = new L.LatLng(d.Latitude,
								d.Longitude);
		
	});
}
// data2011.forEach(function(d) {
// 		d.LatLng = new L.LatLng(d.Latitude,
// 								d.Longitude);
		
// });


// default view upon initial load, 2011 data

	var feature = g.selectAll("circle")
		.data(data2011)
  		.enter().append("circle")
  		.attr("class", function (d) {
  			return d.CategoryID;
  		})
  		.style("opacity", 0.4)
  		.style("fill", function (d) {
  			if (d.CategoryID == "encampment") {
  				return red;
  			} else if (d.CategoryID == "waste") {
  				// console.log("got waste");
  				return yellow;
  			} else {
  				return blue;
  			}
  		})
  		.attr("r", 2)
  		.attr("transform", function(d) {
    		return "translate("+
          		(map.latLngToLayerPoint(d.LatLng).x) +","+
          		map.latLngToLayerPoint(d.LatLng).y +")";
    	});




function drawComplaints(complaintsData) {

	// clear prev year's data
	g.selectAll("circle").remove();

	var feature = g.selectAll("circle")
	  	.data(complaintsData)
	  		//console.log(d.YearOpened);

  		.enter().append("circle")
  		.attr("class", function (d) {
  			return d.CategoryID;
  		})
  		.style("opacity", 0.4)
  		.style("fill", function (d) {
  			if (d.CategoryID == "encampment") {
  				// console.log("got encampment")
  				return red;
  			} else if (d.CategoryID == "waste") {
  				// console.log("got waste");
  				return yellow;
  			} else {
  				// console.log("got needle");
  				return blue;
  			}
  	})
  		.attr("r", 2)
  		.attr("transform", function(d) {
        		return "translate("+
          		(map.latLngToLayerPoint(d.LatLng).x) +","+
          		map.latLngToLayerPoint(d.LatLng).y +")";
        	});

  	checkForToggle();

  	map.on("zoomend", update);
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




  //   console.log('updated at  ' + new Date().setTime(new Date().getTime() - start.getTime()) + ' ms ');

  //   checkForToggle();

  // }


function handleChange (e) {
    var option   = e.target.options[e.target.selectedIndex];
    var data = eval("data" + option.value);
    // console.log(data);
    drawComplaints(data);

}


var yearSelect = document.querySelector('select');
yearSelect.addEventListener('change', handleChange, false);



function handleCommand (e) {
    var pointClass = '.'+e.target.id;
    if (e.target.checked) {
      // console.log(pointClass);
      d3.selectAll(pointClass).attr('visibility', 'visible');
    } else {
      d3.selectAll(pointClass).attr('visibility', 'hidden');
    }
    checkForToggle();
}

var nodes = document.querySelectorAll('.toggle');
for (var i = 0; i < nodes.length; i++) {
  	// console.log(i);
  nodes[i].addEventListener('click', handleCommand, false);
}



map.on("zoomend", update);
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

// show tooltip
// var tooltip = d3.select("div.tooltip-srosmap");
