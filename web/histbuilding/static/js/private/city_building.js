var map, drawnItems, nonEditableDrawnItems;
var currentLocation;
var initMapFlag = true;
var buildingtable;
$(document).ready(function() {

    buildingtable = $('#cityBuildingTable').DataTable();

    $('input[name="location"]').typeahead({
        onSelect: function(item) {
            $('#manageCityBuilding').show();
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
        $('#manageCityBuilding').hide();
        $(this).hide();
        currentLocation = undefined;
        $('#cityBuildingForm input[name="oid"]').val(null);
        $('#cityBuildingForm').trigger('reset');
        removeMarkers(false);
    });

    $('#newCityBuilding').on('click', function() {
        $(this).hide();
        $('#cardTitle').text(gettext("Nuovo Edificio"));
        $('#cityBuildingForm input[name="oid"]').val(null);
        $('#cityBuildingForm').trigger('reset');
        removeMarkers(true);
        if (currentLocation['geo']['type'] == 'Polygon') {
            map.fitBounds(L.polygon(currentLocation['geo']['coordinates']).getBounds());
        }
    });
    $('#cityBuildingTable').on('click', '.btn-primary', function() {
        console.log('edit');
        oid = $(this).data('oid');
        $.ajax({
            url: "./manageCityBuilding/",
            method: 'GET',
            data: { 'oid': oid },

        }).done(function(response) {
            doc = response['doc'];
            $('#cardTitle').text(gettext("Modifica Edificio") + ":<<" + doc['name'] + ">>");
            $('#cityBuildingForm input[name="oid"]').val(doc['_id']['$oid']);
            $('#cityBuildingForm input[name="name"]').val(doc['name']);
            $('#cityBuildingForm input[name="type"]').val(doc['type']);
            $('#cityBuildingForm input[name="function"]').val(doc['function']);
            $('#newCityBuilding').show();

            if (doc['geo']) {
                removeMarkers(true);
                if (doc['geo']['type'] == 'Point') {
                    c = doc['geo']['coordinates']
                    var marker = drawnItems.addLayer(L.marker([c[0], c[1]]));
                    map.setView(new L.LatLng(c[0], c[1]), 16);
                    enableDraw(false);
                }
                if (doc['geo']['type'] == 'Polygon') {
                    c = doc['geo']['coordinates']
                    var zoompoly = L.polygon(c);
                    var polygon = drawnItems.addLayer(L.polygon(c));
                    map.fitBounds(zoompoly.getBounds());
                    enableDraw(false);
                }
            }
        });

    })

    $('#saveCityBuilding').on('click', function() {
        data = {
            'oid': null,
            'name': null,
            'type': null,
            'function': null,
            'geo': null
        };
        data['oid'] = $('#cityBuildingForm input[name="oid"]').val();
        data['name'] = $('#cityBuildingForm input[name="name"]').val();
        data['type'] = $('#cityBuildingForm input[name="type"]').val()
        data['function'] = $('#cityBuildingForm input[name="function"]').val();
        data['geo'] = getMarkers();
        $('#newCityBuilding').hide();

        $.ajax({
            url: "./manageCityBuilding/",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function(response) {
            toastr["success"](response['message']);
            doc = response['doc'];
            $('#cardTitle').text(gettext("Nuovo Edificio"));
            updateLocationEntities(currentLocation['_id']['$oid'])
            $('#cityBuildingForm input[name="oid"]').val(null);
            $('#cityBuildingForm').trigger('reset');
            removeMarkers(true);
        });



    });
    $('#cancelCityBuilding').on('click', function() {
        r = confirm(gettext("Vuoi davvero cancellare tutte le modifiche?"));
        if (r == true) {
            a = $('#cityBuildingForm input[name="oid"]').val();

            $('#cityBuildingForm').trigger('reset');
            if (a != null) {
                $('#cityBuildingForm input[name="oid"]').val(a);
            }
            removeMarkers(true);

        }
    });

});




function updateLocationEntities(oid) {
    $.ajax({
        url: "./manageCityBuilding/",
        method: 'GET',
        data: { 'locationid': oid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        loc = response['location'];
        currentLocation = loc;
        if (loc['geo']) {
            removeMarkers(true);
            if (loc['geo']['type'] == 'Point') {
                c = loc['geo']['coordinates'];
                removeMarkers(false);
                var marker = nonEditableDrawnItems.addLayer(L.marker([c[0], c[1]]));

            }
            if (loc['geo']['type'] == 'Polygon') {
                c = loc['geo']['coordinates'];
                removeMarkers(false);
                var polygon = nonEditableDrawnItems.addLayer(L.polygon(c));
                map.fitBounds(polygon.getBounds());

            }
            docs = response['docs']
            buildingtable.destroy();
            $('#cityBuildingTable tbody').empty();

            for (var i = 0; i < docs.length; i++) {
                $('#cityBuildingTable tbody').append("<tr><td>" + docs[i]['name'] + "</td><td>" + docs[i]['type'] + "</td><td>" + docs[i]['function'] + "</td>><td><button type='button' class='btn btn-primary' data-oid='" + docs[i]['_id']['$oid'] + "'><span class='oi oi-pencil'></span></button></td></tr> ")
            }
            buildingtable = $('#cityBuildingTable').DataTable();

        }

    });
}

function initMap() {
    map = L.map('map').setView([44.96, 7.566], 8);
    drawnItems = L.featureGroup().addTo(map);
    nonEditableDrawnItems = L.featureGroup().addTo(map);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(map);


    L.control.layers({ 'drawlayer': drawnItems, 'noneditabledrawlayer': nonEditableDrawnItems }).addTo(map);


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
        enableDraw(true);

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


function removeMarkers(editable) {
    if (editable) {
        drawnItems.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                drawnItems.removeLayer(layer);
                enableDraw(true);
            }

            if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                drawnItems.removeLayer(layer);
                enableDraw(true);
            }


        });
    } else {
        nonEditableDrawnItems.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                nonEditableDrawnItems.removeLayer(layer);
                enableDraw(true);
            }

            if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                nonEditableDrawnItems.removeLayer(layer);
                enableDraw(true);
            }


        });
    }
}

function getMarkers() {
    markers = null;
    drawnItems.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            markers = { 'type': 'Point', 'coordinates': layer.getLatLng() };
        }

        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            markers = { 'type': 'Polygon', 'coordinates': layer.getLatLngs() };
        }
    });
    return markers;
}