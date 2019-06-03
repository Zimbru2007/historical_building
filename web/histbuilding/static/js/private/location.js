var map, drawnItems;

$(document).ready(function() {

    listTags = $('input[name="previous_name"]').amsifySuggestags({
          type : 'amsify',
    });
    

    initMap();

    $('#locationTable').on('click', '.oi-pencil', function(){
        console.log('edit');
        oid = $(this).parents('button').data('oid');
        $.ajax({
            url: "./manageLocation/",
            method: 'GET',
            data: {'oid': oid},
            
        }).done(function(response) { 
            console.log(response);
            doc = response['doc'];
            $('#locationForm input[name="oid"]').val(doc['_id']['$oid']);
            $('#locationForm input[name="name"]').val(doc['name']);
            if (doc['previous_name'].length){
                $('#locationForm input[name="previous_name"]').val(doc['previous_name'].join());
                $('input[name="previous_name"]').amsifySuggestags({type : 'amsify',}, 'refresh');
            }
            $('#locationForm input[name="first_date"]').val(doc['first_date']);
            if (doc['geo']){
                if (doc['geo']['type'] == 'Point'){
                    c = doc['geo']['coordinates']
                    var marker = L.marker([c[0], c[1]]).addTo(map);
                    enableDraw(false);
                }
                if (doc['geo']['type'] == 'Polygon'){
                    c = doc['geo']['coordinates']
                    console.log(c)
                    var polygon = drawnItems.addLayer(L.polygon(c))//.addTo(map);
                    enableDraw(false);
                }
            }
        });

    })

    $('#saveLocation').on('click', function(){
        data = {'oid': null,
                'name': null,
                'previous_name': [],
                'first_date': null,
                'geo': null
        };
        data['oid'] = $('#locationForm input[name="oid"]').val();
        data['name']= $('#locationForm input[name="name"]').val();
        data['previous_name']= $('#locationForm input[name="previous_name"]').val().split(',')
        data['first_date']= $('#locationForm input[name="first_date"]').val();
        data['geo']= getMarkers();

        console.log(data);

        $.ajax({
            url: "./manageLocation/",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function(response) { 
            toastr["success"](response['message']);
            doc = response['doc'];
            $('#locationTable').append("<tr><td>" +  doc['name'] +"</td><td><button type='button' class='btn btn-primary' data-oid="+ doc['oid'] +"><span class='oi oi-pencil'></span></button></td></tr>");
            $('#locationForm').trigger('reset');
            $('input[name="previous_name"]').amsifySuggestags({type : 'amsify',}, 'refresh');
            removeMarkers();
        });


    })
});


function initMap() {
    map = L.map('map').setView([44.96, 7.566], 8);
    drawnItems = L.featureGroup().addTo(map);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
    }).addTo(map);
    
    
    L.control.layers({ 'drawlayer': drawnItems }).addTo(map);


    map.addControl(new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: false
            }
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            },
            polyline: false,
            circle:false
        }
    }));

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;

        drawnItems.addLayer(layer);
    });

    map.on('draw:drawstop', function (e) {
        var layers = e.layers;
        markers = getMarkers();
        if (markers){
            enableDraw(false)
        }
    });

    map.on('draw:deletestop', function (e) {
        var layers = e.layers;
        markers = getMarkers();
        if (markers){
            enableDraw(true);
        }
    });
    
  }

function enableDraw(flag){
    if (flag){
        document.querySelectorAll(".leaflet-draw-toolbar-top a").forEach(function(elem) { 
            elem.style.pointerEvents = "";     
        });
    }
    else{
        document.querySelectorAll(".leaflet-draw-toolbar-top a").forEach(function(elem) { 
            elem.style.pointerEvents = "none";
        });
    }
}


function removeMarkers(){
    map.eachLayer(function(layer) {
        if(layer instanceof L.Marker){
            map.removeLayer(layer);
        }
        /*
        if(layer instanceof L.Circle){
            markers.push({'type': 'Circle',coordinates: {'center': layer.getLatLng(), radius:  layer.getRadius()}});
        }
        */
        if(layer instanceof L.Polygon || layer instanceof L.Rectangle){
            map.removeLayer(layer);
        }            
    });
}

function getMarkers(){
    markers=null;
    map.eachLayer(function(layer) {
        if(layer instanceof L.Marker){
            markers= {'type': 'Point','coordinates': layer.getLatLng()};
        }
        /*
        if(layer instanceof L.Circle){
            markers.push({'type': 'Circle',coordinates: {'center': layer.getLatLng(), radius:  layer.getRadius()}});
        }
        */
        if(layer instanceof L.Polygon || layer instanceof L.Rectangle){
            markers ={'type': 'Polygon','coordinates': layer.getLatLngs()} ;
        }            
    });
    return markers;
  }