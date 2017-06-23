
var d3 = require('d3');
require("leaflet.markercluster");

var map = L.map('complaints-map');

// Disable drag and zoom handlers.
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
        if (d.CategoryID == "encampment") {
          var marker = L.marker(new L.LatLng(d.Latitude, d.Longitude),{icon: greenIcon});
        } else if (d.CategoryID == "waste") {
      		var marker = L.marker(new L.LatLng(d.Latitude, d.Longitude),{icon: yellowIcon});
      	} else {
      		var marker = L.marker(new L.LatLng(d.Latitude, d.Longitude),{icon: blueIcon});
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

// OPTION: LOAD DATA ONE AT A TIME
getFile(markers2016,"6").then(()=>getFile(markers2015,"5")).then(()=>getFile(markers2014,"4")).then(()=>getFile(markers2013,"3")).then(()=>getFile(markers2012,"2")).then(()=>getFile(markers2011,"1"));

var yearSelect = document.querySelector('select');
yearSelect.selectedIndex = 5;
yearSelect.addEventListener('change', handleChange, false);

function handleChange (e) {
  var option   = e.target.options[e.target.selectedIndex];
  var classname = ".year" + option.value;
  map.removeLayer(markers2011);
  map.removeLayer(markers2012);
  map.removeLayer(markers2013);
  map.removeLayer(markers2014);
  map.removeLayer(markers2015);
  map.removeLayer(markers2016);
  map.addLayer(eval("markers201"+option.value[3]));
}

// -------------------------------------------------------------------------------------------------------------------------------------------
// ALTERNATIVE CODE TO LOAD ALL DATA ALL AT ONCE THEN PLOT ---------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------


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
