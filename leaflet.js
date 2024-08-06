var map = L.map('map').setView([5.1632955, -69.4146705], 6);


// osm layer
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 8,
    minZoom: 6,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
osm.addTo(map);

var polygon = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"coordinates":[[[-66.08866934091276,9.610750944501703],[-66.08866934091276,7.596371555444335],[-64.11507888925502,7.596371555444335],[-64.11507888925502,9.610750944501703],[-66.08866934091276,9.610750944501703]]],"type":"Polygon"}}]};

var h = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            -66.08866934091276,9.610750944501703
          ],
          "type": "Point"
        }
      }
    ]
  };
// municipal polygons
new L.geoJSON(divMunicipal).addTo(map);
new L.geoJSON(polygon).addTo(map);
new L.GeoJSON(h).addTo(map);

//Layer controls
var baseLayers = {
    "OpenStreetMap": osm,
    "Municipios": divisionMunicipal,
    "Estados": divisionEstadal,
    "polygon": polygon,
};

var overlays = {
    "Marker": marker,
    "Roads": roadsLayer
};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

