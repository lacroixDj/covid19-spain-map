$(document).ready(function() {

    var southWest = L.latLng(32.58942870550602, -22.741699218750004);
    var northEast = L.latLng(45.356798505305065,	12.897949218750002);
    var bounds = L.latLngBounds(southWest, northEast);


    var center = bounds.getCenter();


    var map_box_token = "pk.eyJ1IjoibGFjcm9peGRqIiwiYSI6ImNqaXk3ejM3ZzA3MGYzcXA3ZnJ2d2JwenkifQ._fIsND7-Tmq4GUaMsZq7lA";

    var darkTileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: '© <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: map_box_token
    });

    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var spainmap = L.map('spain-map', {
        center: center,
        zoom: 10,
        //minZoom: 10,
        //maxZoom: 19,
        //maxBounds: bounds,
        zoomControl: false
    });

    spainmap.flyToBounds(bounds);
    darkTileLayer.addTo(spainmap);

    var covid_data_file = "data/covid-data.json";
    var covid_data_total_file = "data/covid-data-total.json";
    var ccaa_layer_file = "data/comunidades-autonomas-espanolas.geojson";

    var covid_data = {};
    var covid_data_total = {};
    var ca_layers_group = []; 


    var donutMarkersClusters = L.DonutCluster(
        {
            maxClusterRadius: 20, 
            chunkedLoading: true
        }, 
        {
            key: 'title',
            sumField: 'value',
            order:['Fallecidos','Infectados'],
            title: {Infectados:'I', Fallecidos:'F'},
            arcColorDict: {
                Infectados: '#ffc107',
                Fallecidos: '#dc3545'
            },
    });


    $.getJSON(covid_data_file, function( json_data ) {
        covid_data = json_data;
        
        covid_data.forEach(element => {

            let marker_infectados = L.marker(element.geo_point_2d, {
                title: "Infectados",
                value: element.data.total_casos_infectados
            });

            marker_infectados.bindPopup("Infectados: " + element.data.total_casos_infectados);

            let marker_fallecidos = L.marker(element.geo_point_2d, {
                title: "Fallecidos",
                value: element.data.fallecidos
                // value: element.data.fallecidos
            });

            marker_fallecidos.bindPopup("Fallecidos: " + element.data.fallecidos);
       
            donutMarkersClusters.addLayer(marker_infectados);
            donutMarkersClusters.addLayer(marker_fallecidos);
            
            /*   let layers = {
                singleMarkerLayer: L.marker(element.geo_point_2d),                
                // clusterMarkerLayer: {},                
                // circleMarkerLlayer: {}
            };
           
            ca_layers_group[element.codigo] = L.layerGroup();
            ca_layers_group[element.codigo].addLayer(layers.singleMarkerLayer);
            ca_layers_group[element.codigo].addTo(spainmap); */
        });

        
        spainmap.addLayer(donutMarkersClusters);

    });

    $.getJSON(covid_data_total_file, function( json_data ) {
        covid_data_total = json_data;
        console.log(covid_data_total);
    });

    var ccaaStyle = {
        weight: 1,
        opacity: 0.7,
        opacity: 0.3,
        color: '#ffc107',
        fillColor: "#ffffff",
        fillOpacity: 0
    };


    ccaaLayer = new L.GeoJSON.AJAX(ccaa_layer_file, {
        style: ccaaStyle,
        onEachFeature: function(feature,layer){
            console.log("on-each-feature:", feature, layer);
            
            //var marker = L.marker([51.5, -0.09]).addTo(mymap);

        },
    });

    spainmap.addLayer(ccaaLayer);

});
