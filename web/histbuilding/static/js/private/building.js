var map, drawnItems;
var currentLocation;
var initMapFlag = true;
$(document).ready(function() {

    listTags = $('input[name="old_names"]').amsifySuggestags({
        type: 'amsify',
    });


    $('input[name="location"]').typeahead({
        onSelect: function(item) {
            console.log(item);
            $('#manageBuilding').show();
            $('#buildingForm input[name="locationid"]').val(item.value);
            $('input[name="location"]').prop('disabled', 'disabled');
            $('#changeLocation').show();

            if (initMapFlag) {
                initMap();
                initMapFlag = false;
            }
            updateLocationEntities(item['value']);
        },
        ajax: {
            url: '/private/luoghi/manageLocation/',
            displayField: "name",
            triggerLength: 1,
            preProcess: function(data) {
                listLocations = [];
                console.log(data);
                for (var i = 0; i < data['docs'].length; i++) {
                    listLocations.push({ 'id': data['docs'][i]['_id']['$oid'], 'name': data['docs'][i]['name'] });
                }
                return listLocations;
            }
        }
    });

    $('#changeLocation').on('click', function() {
        $('input[name="location"]').prop('disabled', '');
        $('input[name="location"]').val(undefined);
        $('#manageBuilding').hide();
        $(this).hide();
        currentLocation = undefined;
    });

    //initMap();

    $('#buildingTable').on('click', '.btn-primary', function() {
        console.log('edit');
        oid = $(this).data('oid');
        $.ajax({
            url: "/private/palazzi/manageBuilding/",
            method: 'GET',
            data: { 'oid': oid },

        }).done(function(response) {
            console.log(response);
            doc = response['doc'];
            $('#buildingForm input[name="oid"]').val(doc['_id']['$oid']);
            $('#buildingForm input[name="name"]').val(doc['name']);
            if (doc['recognized']) {
                $('#buildingForm input[name="recognized"]').prop("checked", true);
            } else {
                $('#buildingForm input[name="recognized"]').prop("checked", false);
            }

            if (doc['old_names'].length) {
                console.log(doc['old_names'].join())
                $('#buildingForm input[name="old_names"]').val(doc['old_names'].join());
                $('input[name="old_names"]').amsifySuggestags({ type: 'amsify' }, 'refresh');
            }


            if (doc['geo']) {
                //removeMarkers();
                if (doc['geo']['type'] == 'Point') {
                    c = doc['geo']['coordinates'];
                    var marker = drawnItems.addLayer(L.marker([c[0], c[1]]));
                    ////  enableDraw(false);
                }
                if (doc['geo']['type'] == 'Polygon') {
                    c = doc['geo']['coordinates'];
                    console.log(c);
                    var polygon = drawnItems.addLayer(L.polygon(c)); //.addTo(map);
                    map.fitBounds(polygon.getBounds());
                    // enableDraw(false);
                }
            }
        });

    })

    $('#saveBuilding').on('click', function() {
        data = {
            'oid': null,
            'name': null,
            'old_names': null,
            'recognized': null,
            'geo': null
        };
        data['oid'] = $('#buildingForm input[name="oid"]').val();
        data['locationid'] = $('#buildingForm input[name="locationid"]').val();
        data['name'] = $('#buildingForm input[name="name"]').val();
        data['old_names'] = $('#buildingForm input[name="old_names"]').val().split(',');
        data['recognized'] = $('#buildingForm input[name="recognized"]').is(":checked");
        data['geo'] = getMarkers();

        console.log(data);

        $.ajax({
            url: "/private/palazzi/manageBuilding/",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function(response) {
            toastr["success"](response['message']);
            doc = response['doc'];
            updateLocationEntities(currentLocation['_id']['$oid']);
            $('#buildingForm input[name="oid"]').val(null);
            $('#buildingForm').trigger('reset');
            $('#buildingForm input[name="old_names"]').amsifySuggestags({ type: 'amsify', }, 'refresh');

            removeMarkers();
        });



    });


});




function updateLocationEntities(oid) {
    $.ajax({
        url: "/private/palazzi/manageBuilding/",
        method: 'GET',
        data: { 'locationid': oid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        loc = response['location'];
        currentLocation = loc;
        if (loc['geo']) {
            removeMarkers();
            if (loc['geo']['type'] == 'Point') {
                c = loc['geo']['coordinates'];
                var marker = drawnItems.addLayer(L.marker([c[0], c[1]]));
                //enableDraw(false);
            }
            if (loc['geo']['type'] == 'Polygon') {
                c = loc['geo']['coordinates'];
                console.log(c);
                var polygon = drawnItems.addLayer(L.polygon(c)); //addTo(map);
                map.fitBounds(polygon.getBounds());
                //enableDraw(false);
            }

            docs = response['docs'];

            $('#buildingTable tbody').empty();
            for (var i = 0; i < docs.length; i++) {
                $('#buildingTable tbody').append("<tr><td>" + docs[i]['name'] + "</td><td><button type='button' class='btn btn-primary' data-oid='" + docs[i]['_id']['$oid'] + "'><span class='oi oi-pencil'></span></button></td></tr> ")
            }
            //removeMarkers();

        }

    });
}

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
                allowIntersection: true,
                showArea: true
            },
            polyline: false,
            circle: false
        }
    }));

    map.on(L.Draw.Event.CREATED, function(event) {
        var layer = event.layer;

        drawnItems.addLayer(layer);
    });

    map.on('draw:drawstop', function(e) {
        var layers = e.layers;
        markers = getMarkers();
        if (markers) {
            enableDraw(false)
        }
    });

    map.on('draw:deletestop', function(e) {
        var layers = e.layers;
        markers = getMarkers();
        if (!markers) {
            enableDraw(true);
        }
    });

}

function enableDraw(flag) {
    if (flag) {
        document.querySelectorAll(".leaflet-draw-toolbar-top a").forEach(function(elem) {
            elem.style.pointerEvents = "";
        });
    } else {
        document.querySelectorAll(".leaflet-draw-toolbar-top a").forEach(function(elem) {
            elem.style.pointerEvents = "none";
        });
    }
}


function removeMarkers() {
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
            enableDraw(true);
        }
        /*
        if(layer instanceof L.Circle){
            markers.push({'type': 'Circle',coordinates: {'center': layer.getLatLng(), radius:  layer.getRadius()}});
        }
        */
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            map.removeLayer(layer);
            enableDraw(true);
        }
    });
}

function getMarkers() {
    markers = null;
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            markers = { 'type': 'Point', 'coordinates': layer.getLatLng() };
        }
        /*
        if(layer instanceof L.Circle){
            markers.push({'type': 'Circle',coordinates: {'center': layer.getLatLng(), radius:  layer.getRadius()}});
        }
        */
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            markers = { 'type': 'Polygon', 'coordinates': layer.getLatLngs() };
        }
    });
    return markers;
}