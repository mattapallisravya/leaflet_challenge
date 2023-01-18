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
            var baseMaps = {
                "Street Map": street,
                "Topographic": topo,
                "Water Color": Stamen_Watercolor,
                "World img": Esri_WorldImagery
              };

            // Create an overlay object to hold our overlay.
            var overlayMaps = {
            Earthquakes: earthquakes
            };

            // Create our map, giving it the streetmap and earthquakes layers to display on load.
            var myMap = L.map("map", {
              center: [
                37.09, -95.71
              ],
              zoom: 5,
              layers: [street, earthquakes]
            });

            // Create a layer control.
            // Pass it our baseMaps and overlayMaps.
            // Add the layer control to the map.
            L.control.layers(baseMaps, overlayMaps, {
              collapsed: false
            }).addTo(myMap);

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
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>depth: ${feature.geometry.coordinates[2]}</p>`);
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
        return "#008000";
    }
    else if(depth>10 && depth<=20){
      return "#FFA500";
    }
    else if(depth>20 && depth<=30){
      return "#800080";
    }
    else if(depth>30 && depth<=40){
      return "#00FFFF";
    }
    else if(depth>40 && depth<=50){
      return "#0000FF";
    }
    else if(depth>50 && depth<=60){
      return "#4682B4";
    }
    else if(depth>60 && depth<=80){
      return "#F0E68C";
    }
    else if(depth>80 && depth<=90){
      return "#FF8C00";
    }
    else{
      return "#FF0000";
    }

}


