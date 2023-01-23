// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
})
let Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 1,
  maxZoom: 16,
  ext: 'jpg'
})
let Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

function createMap(earthquakes) {
            
            // Create a baseMaps object.
            let baseMaps = {
                "Street Map": street,
                "Topographic Map": topo,
                "Stamen Watercolor Map": Stamen_Watercolor,
                "Esri WorldImagery Map": Esri_WorldImagery
              };

            // Create an overlay object to hold our overlay.
            let overlayMaps = {
            Earthquakes: earthquakes
            };

            // Create our map, giving it the streetmap and earthquakes layers to display on load.
            let myMap = L.map("map", {
              center: [
                37.09, -95.71
              ],
              zoom: 3,
              layers: [street, earthquakes]
            });

            // Create a layer control.
            // Pass it our baseMaps and overlayMaps.
            // Add the layer control to the map.
            L.control.layers(baseMaps, overlayMaps, {
              collapsed: false
            }).addTo(myMap);
            myMap.on('overlayadd',function(e){
              alert(e.name+" was just turned on")
            });
            myMap.on('overlayremove', function(e){
              alert(e.name+ " was just turned off")
            })
            
          // Set up the legend.
          let legend = L.control({ position: "bottomright" });
          legend.onAdd = function() {
            let div = L.DomUtil.create("div", "info legend");
            let limits = [0,10, 20, 30, 40, 50, 60, 70, 80, 90]
            let colors = ["#98FB98","#FF69B4","#FA8072","#E9967A","#FFA07A","#DC143C","#FF0000","#B22222","#FF4500", "#800000"]
           labels=[]

            // Add the minimum and maximum.
            let legendInfo = "<h1>Depth of earthquake<br /></h1>" +
              "<div class=\"labels\">" 
             "</div>";

            div.innerHTML = legendInfo;

            limits.forEach(function(limit, index) {
              div.innerHTML += "<i style='background: " + colors[index] + "'></i> "
            +limits[index] + (limits[index + 1] ? "&ndash;" + limits[index + 1] +"<br>": "+");
             
            });
            
          return div;
          };

          // Adding the legend to the map
          legend.addTo(myMap);

}

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
 });

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
                    <p>Magnitude: ${feature.properties.mag}</p>
                    <p>depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  function createCircleMarker(feature, latlng){
    let options={
        radius : feature.properties.mag*5,
        color : chooseColor(feature.geometry.coordinates[2]),
        fillColor : chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.75
    }
    return L.circleMarker(latlng ,options);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.

  let earthquakes = L.geoJSON(earthquakeData, {
   
    onEachFeature: onEachFeature,
     pointToLayer: createCircleMarker
  });

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);

}
function chooseColor(depth){
    
    if(depth<=10){
        return "#98FB98";
    }
    else if(depth>10 && depth<=20){
      return "#FF69B4";
    }
    else if(depth>20 && depth<=30){
      return "#FA8072";
    }
    else if(depth>30 && depth<=40){
      return "#E9967A";
    }
    else if(depth>40 && depth<=50){
      return "#FFA07A";
    }
    else if(depth>50 && depth<=60){
      return "#DC143C";
    }
    else if(depth>60 && depth<=70){
      return "#FF0000";
    }
    else if(depth>70 && depth<=80){
      return "#B22222";
    }
    else if(depth>80 && depth<=90){
      return "#FF4500";
    }
    else{
      return "#800000";
    }

}




