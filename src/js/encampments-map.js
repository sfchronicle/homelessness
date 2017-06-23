
var d3 = require('d3');
require("leaflet.markercluster");

// use this color code instead
// var encampment_color = "#79b675";
// var waste_color = "#dfb372";
// var needle_color = "#539ecd";

// color code
// var red = "#EB5773";
// var yellow = "#f9ac06";
// var blue = "#3068e0"

var map = L.map('complaints-map');

// Disable drag and zoom handlers.
// map.dragging.disable();
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.keyboard.disable();

var greenIcon = new L.Icon({
  iconUrl: '../assets/icons/marker-icon-2x-green.png',
  shadowUrl: '../assets/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
  iconUrl: '../assets/icons/marker-icon-2x-grey.png?',
  shadowUrl: '../assets/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
  iconUrl: '../assets/icons/marker-icon-2x-blue.png',
  shadowUrl: '../assets/icons/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);

if (screen.width <= 480) {
  map.setView(new L.LatLng(37.75, -122.43), 11);
} else {
  map.setView(new L.LatLng(37.77, -122.44), 12);
}

var count = 0;
var markers2011 = L.markerClusterGroup();
var markers2012 = L.markerClusterGroup();
var markers2013 = L.markerClusterGroup();
var markers2014 = L.markerClusterGroup();
var markers2015 = L.markerClusterGroup();
var markers2016 = L.markerClusterGroup();

// function to load file and generate a marker layer
var getFile = function(markers,index) {
  // wrap the async value in a promise
  return new Promise(function(ok, fail) {
    var fname = "http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-data-cleaned/data201"+index+".csv";
    d3.csv(fname, function(data) {
      // data.forEach(function(d) {
      //   d.LatLng = new L.LatLng(d.Latitude, d.Longitude);
      // });
      data.forEach(function(d) {
        d.LatLng = new L.LatLng(d.Latitude, d.Longitude);
        // console.log(d);
        if (d.CategoryID == "encampment") {
          var marker = L.marker(new L.LatLng(d.Latitude, d.Longitude),{icon: greenIcon});
        } else if (d.CategoryID == "waste") {
      		var marker = L.marker(new L.LatLng(d.Latitude, d.Longitude),{icon: yellowIcon});
      	} else {
      		var marker = L.marker(new L.LatLng(d.Latitude, d.Longitude),{icon: blueIcon});
      	}
        if (d.Latitude < 0) {
          console.log("problem");
        }
        marker.bindPopup(d.Address+": "+d.CategoryGroup+" reported on "+d.Opened);
        markers.addLayer(marker);
        count++;
      });
      map.addLayer(markers);
      if (index != 6) {
        map.removeLayer(markers);
        // setTimeout(() => map.removeLayer(markers), 300);
      }
      ok(data);
    })
  })

};

// var fullDataSet = [];
// var getDataFile = function(index) {
//   return new Promise(function(ok, fail) {
//     var fname = "http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_201"+index.toString()+".csv";
//     d3.csv(fname, function(data) {
//       data.forEach(function(d) {
//         d.LatLng = new L.LatLng(d.Latitude, d.Longitude);
//       });
//       fullDataSet.push.apply(fullDataSet, data);
//       ok("success");
//     });
//   });
// }

// var drawData = function() {
//
//   var markers = L.markerClusterGroup();
//   fullDataSet.forEach(function(d) {
//     d.LatLng = new L.LatLng(d.Latitude, d.Longitude);
//     var marker = L.marker(new L.LatLng(d.Latitude, d.Longitude),{icon: greenIcon});
//     marker.bindPopup(d.Address+": "+d.CategoryGroup+" on "+d.Closed);
//     markers.addLayer(marker);
//     count++;
//   });
//   map.addLayer(markers);
//   // console.log(requests);
//
// }

// OPTION: LOAD ALL DATA THEN PLOT

// // let's create an array of promises
// var indices = [1, 2, 3, 4, 5, 6];
// // convert index to promise via a map
// var requests = indices.map(getDataFile);
// console.log(requests);
// //wait for all promises to complete
// Promise.all(requests).then(function(responses) {
//   console.log("ALL PROMISES FILLED");
//   console.log(requests);
//   console.log(fullDataSet);
//   //responses is an array with all the data files in it
//   responses.forEach(drawData);
// });

// OPTION: LOAD DATA ONE AT A TIME
getFile(markers2016,"6").then(()=>getFile(markers2015,"5")).then(()=>getFile(markers2014,"4")).then(()=>getFile(markers2013,"3")).then(()=>getFile(markers2012,"2")).then(()=>getFile(markers2011,"1"));

var yearSelect = document.querySelector('select');
yearSelect.selectedIndex = 5;
yearSelect.addEventListener('change', handleChange, false);

function handleChange (e) {
  var option   = e.target.options[e.target.selectedIndex];
  var classname = ".year" + option.value;
  console.log(option.value[3]);
  map.removeLayer(markers2011);
  map.removeLayer(markers2012);
  map.removeLayer(markers2013);
  map.removeLayer(markers2014);
  map.removeLayer(markers2015);
  map.removeLayer(markers2016);
  map.addLayer(eval("markers201"+option.value[3]));
  // getFile(option.value[3]);
}

// for (var i = 0; i < addressPoints2.length; i++) {
// 	var a = addressPoints2[i];
// 	var title = a[2];
// 	var marker = L.marker(L.latLng(a[0], a[1]), { title: title });
// 	marker.bindPopup(title);
// 	markerList.push(marker);
// }

//console.log('start clustering: ' + window.performance.now());

// markers.addLayers(markerList);
// map.addLayer(markers);


// var svgMap = d3.select("#complaints-map").select("svg");
// var g = svgMap.append("g");
//
// var getFile = function(index) {
//   // wrap the async value in a promise
//   return new Promise(function(ok, fail) {
//     var fname = "http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_201"+index.toString()+".csv";
//     d3.csv(fname, function(data) {
//       data.forEach(function(d) {
//         d.LatLng = new L.LatLng(d.Latitude, d.Longitude);
//       });
//       drawData(data)
//       // resolve the promise
//       ok(data);
//     })
//   })
// };
//
// // var listFiles = [1,2,3,4,5,6];
// // listFiles.forEach(function(num) {
// //   getFile(num).then(drawData);
// // });
//
// // getFile(1).then(getFile(2)).then(getFile(3)).then(getFile(4)).then(getFile(5)).then(getFile(6));
//
// // var allMapData = require('../encampments-map-2017/alldata311.json');
//
// /* Add a LatLng object to each item in each of the datasets */
//
// // var fullDataSet = [];
// //
// // var readFiles = function(files) {
// //   var p = Q(); // Promise.resolve() without Q
// //
// //   files.forEach(function(file){
// //       p = p.then(function(){ return readFile(file); }); // or .bind
// //   });
// //   return p;
// // };
//
//
// // var listFiles = [1,2,3,4,5,6]
// // var readFiles = function(files) {
// //   var p = Promise.resolve();
// //
// //   files.forEach(function(num){
// //       var fname = "http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_201"+num.toString()+".csv";
// //       console.log(fname);
// //
// //       p = p.then(function(){
// //
// //         d3.csv(fname,function(data) {
// //           data.forEach(function(d) {
// //             d.LatLng = new L.LatLng(d.Latitude,
// //               d.Longitude);
// //           });
// //           p = drawData(data,p);
// //         });
// //
// //
// //       }); // or .bind
// //   });
// //   console.log(p);
// //   return p;
// // };
// // readFiles(listFiles);
//
//
// // window.onload = function(){
// //   for (i = 1; i < 7; i++) {
// //     d3.csv("http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_201"+i.toString()+".csv", function(data){
// //     // d3.csv("./assets/encampments-311-data/data_311_201"+i.toString()+".csv", function(data){
// //
// //     	// var data = eval("data201" + i.toString());
// //     	data.forEach(function(d) {
// //         // console.log(d);
// //
// //         d.LatLng = new L.LatLng(d.Latitude,
// //           d.Longitude);
// //
// //       });
// //
// //       setTimeout(() => drawData(data), 20000*i);
// //       // var fullDataSet = [];
// //       // fullDataSet.push.apply(fullDataSet, data);
// //       // console.log(fullDataSet);
// //       // setTimeout(() => drawData(fullDataSet), 500);
// //       // setInterval(drawData(data), 100);
// //       // drawData(data);
// //       //drawData(fullDataSet);
// //       // console.log(feature);
// //     });
// //   }
// //
// // };
//
// // queue.queue(1)
// // 	.defer(d3.csv, 'http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_2011.csv')
// // 	.defer(d3.csv, 'http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_2012.csv')
// //   .defer(d3.csv, 'http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_2013.csv')
// //   .defer(d3.csv, 'http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_2014.csv')
// //   .defer(d3.csv, 'http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_2015.csv')
// //   .defer(d3.csv, 'http://extras.sfgate.com/editorial/election2016/homeless-data/encampments-311-data/data_311_2016.csv')
// // 	.await(makeMyMap());
// //
// // function makeMyMap(error, data,data2,data3) {
// //   console.log(data);
// //   console.log(data2);
// //   console.log(data3);
// //   data.forEach(function(d) {
// //     // console.log(d);
// //
// //     d.LatLng = new L.LatLng(d.Latitude,
// //       d.Longitude);
// //
// //   });
// //   drawData(data);
// //
// // }
//
//
// function drawData(data){
//   // prints the correct number of the size of the data, by year
//   console.log(data.length);
//
//   // somewhere between above and below, data goes wonky???
//   var feature = g.selectAll("circle")
//   .data(data)
//   .enter().append("circle")
//   .attr("class", function (d) {
//     var twoclass = d.CategoryID + " " + "year" + d.YearOpened;
//         // console.log(d.YearOpened);
//         return twoclass;
//   })
//   .style("opacity", function (d) {
//     if (d.YearOpened == 2011) {
//       console.log("2011");
//       return 0.4;
//     } else {
//       console.log(d.YearOpened);
//       return 0;
//     }
//   })
//   .style("fill", function (d) {
//     if (d.CategoryID == "encampment") {
//       // console.log("got encampment");
//       return encampment_color;
//     } else if (d.CategoryID == "waste") {
//   		// console.log("got waste");
//   		return waste_color;
//   	} else {
//   		return needle_color;
//   	}
//   })
//   .attr("r", 2)
//   .attr("transform", function(d) {
//     return "translate("+
//     (map.latLngToLayerPoint(d.LatLng).x) +","+
//     map.latLngToLayerPoint(d.LatLng).y +")";
//   });
//
//   checkForToggle();
// }
//
//
//
//
// function checkForToggle () {
//   var toggles = document.querySelectorAll('.toggle');
//   // console.log(toggles);
//   for (var i = 0; i < toggles.length; i++) {
//     var pointClass = '.'+toggles[i].id;
//     // console.log(pointClass);
//
//     if (toggles[i].checked) {
//       // console.log(toggles[i]);
//       d3.selectAll(pointClass).attr('visibility', 'visible');
//     } else {
//       d3.selectAll(pointClass).attr('visibility', 'hidden');
//
//     }
//   }
// };
//
//
// // what is going on here????
// function handleChange (e) {
//   d3.selectAll("circle").style('opacity', 0);
//   var option   = e.target.options[e.target.selectedIndex];
//   var classname = ".year" + option.value;
//       // console.log(classname);
//       // console.log(g.selectAll(classname).size());
//
//   d3.selectAll(classname).style('opacity', 0.4);
//   map.on("zoomend", update);
//   update();
// }
//
// var yearSelect = document.querySelector('select');
// yearSelect.addEventListener('change', handleChange, false);
//
// function handleCommand (e) {
//   var pointClass = '.'+e.target.id;
//   //console.log(pointClass);
//   if (e.target.checked) {
//   // console.log(pointClass);
//   // this works: console.log(d3.selectAll(pointClass).size());
//     d3.selectAll(pointClass).attr('visibility', 'visible');
//   } else {
//     d3.selectAll(pointClass).attr('visibility', 'hidden');
//   }
//   checkForToggle();
// }
//
// var nodes = document.querySelectorAll('.toggle');
// for (var i = 0; i < nodes.length; i++) {
//   nodes[i].addEventListener('click', handleCommand, false);
// }
//
// map.on("zoomend", update);
// update();
//
// function update() {
//   d3.selectAll("circle")
//   .filter(function(d) {
//     return d3.select(this).style('opacity') == 0.4;
//   })
//   .attr("transform", function(d) {
//     // console.log(d);
//     return "translate("+
//     map.latLngToLayerPoint(d.LatLng).x +","+
//     map.latLngToLayerPoint(d.LatLng).y +")";
//   })
// }
//
// // show tooltip
// // var tooltip = d3.select("div.tooltip-srosmap");
