var map = L.map('map').setView([5.1632955, -69.4146705], 6);


// map limits
var southWest = L.latLng(-4.0, -80.0); 
var northEast = L.latLng(15.0, -55.0); 
var bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});


// thunderforest
var new_tile = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
maxZoom: 9,
minZoom: 6,
});
new_tile.addTo(map);

// selected feature and popup information for municipios
var selectedLayer = null;

function onEachFeature(features, layer) {
    if (features.properties) {
        layer.on('click', function(e) {
            if (selectedLayer) {
                geojsonLayer.resetStyle(selectedLayer);
            }
            selectedLayer = layer;
            layer.setStyle({
                fillColor: 'yellow'
            });
            var popupContent = "Municipio: " + features.properties.Nomb_Mcpio + "<br>"+ 
                               "Estado: " + features.properties.Nom_Estado + "<br>"+ 
                               "Edmundo González: " + features.properties.db_suma_EG + " (" + features.properties.db_porc_EG.toFixed(2) + "%)" + "<br>"+ 
                               "Nicolás Maduro: " + features.properties.db_suma_NM + " (" + features.properties.db_porc_NM.toFixed(2) + "%)" + "<br>"+ 
                               "Otros candidatos: " + features.properties.db_total_o + " (" + features.properties.db_porc_ot.toFixed(2) + "%)";
            layer.bindPopup(popupContent).openPopup();
            L.DomEvent.stopPropagation(e);
        });
    }
}


// selected feature and popup information for states
function onEachFeatureEstados(features, layer) {
    if (features.properties) {
        layer.on('click', function(e) {
            if (selectedLayer) {
                estados.resetStyle(selectedLayer);
            }
            selectedLayer = layer;
            layer.setStyle({
                fillColor: 'yellow'
            });
            var popupContent = "Estado: " + features.properties.N_ESTADOS + "<br>" +
            "Edmundo González: " + features.properties.db_suma_EG + " (" + features.properties.db_porc_EG.toFixed(2) + "%)" + "<br>"+ 
                               "Nicolás Maduro: " + features.properties.db_suma_NM + " (" + features.properties.db_porc_NM.toFixed(2) + "%)" + "<br>"+ 
                               "Otros candidatos: " + features.properties.db_total_o + " (" + features.properties.db_porc_ot.toFixed(2) + "%)";
            layer.bindPopup(popupContent).openPopup();
            L.DomEvent.stopPropagation(e);
        });
    }
}

/// color gradient
function getColor(d) {
    return d > 80 ? '#034e7b' :
           d > 70  ? '#0570b0' :
           d > 60  ? '#3690c0' :
           d > 50  ? '#74a9cf' :
           d > 40  ? '#a6bddb' :
           d > 30  ? '#d0d1e6' :
           d > 20  ? '#ece7f2' :
           d > 10  ? '#fff7fb' :
                     '#00000';
}
///estilos
function style(features) {
    return {
        fillColor: getColor(features.properties.db_porc_EG),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8
    };
}

// adding geojson to map municipal
var geojsonLayer = new L.geoJson.ajax("https://raw.githubusercontent.com/leomed512/files/master/prueba_union.geojson", {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map); // only adds one layer



// estados
var estados = new L.geoJson.ajax("https://raw.githubusercontent.com/leomed512/geojson_estados/master/union_lista_estados.geojson", {
    style: style,
    onEachFeature: onEachFeatureEstados
}); ///this is added only with layer control



// reset style for unselected feature
map.on('click', function(e) {
    if (selectedLayer) {
        geojsonLayer.resetStyle(selectedLayer);
        estados.resetStyle(selectedLayer);
        selectedLayer = null;
    }
});

// layers
var basemaps = {
    "Resultados municipales": geojsonLayer,
    "Resultados por estado": estados,
};
L.control.layers(basemaps).addTo(map);

// Legend 
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend-horizontal');
    div.innerHTML = '<div class="legend-title">Votos por Edmundo González (%)</div>' +
                    '<div class="gradient-bar"></div>' +
                    '<div class="labels">' +
                    '<span>>80</span><span>70</span><span>60</span><span>50</span><span>40</span><span>30</span><span>20</span><span>10</span><span>Sin datos</span>' +
                    '</div>';
    return div;
};

legend.addTo(map);


//////// north arrow

var northIcon = L.icon({
            iconUrl: 'https://res.cloudinary.com/arawato666/image/upload/v1724443852/icons8-north-direction-64_1_tvykio.png', 
            iconSize: [50, 50], 
            iconAnchor: [300, -10]
        });
var bounds = map.getBounds();
var northEastCorner = bounds.getNorthEast();

// marker
var northMarker = L.marker([northEastCorner.lat, northEastCorner.lng], { icon: northIcon }).addTo(map);

// update position
function updateNorthArrow() {
    var bounds = map.getBounds();
    var northEastCorner = bounds.getNorthEast();
    northMarker.setLatLng([northEastCorner.lat, northEastCorner.lng]);
}

// relate to scroll and zoom
map.on('move', updateNorthArrow);
map.on('zoom', updateNorthArrow);

// call function
updateNorthArrow();