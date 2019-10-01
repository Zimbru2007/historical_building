var map, drawnItems /*, isedit = false*/ ;

$(document).ready(function() {


    listTags = $('input[name="previous_name"]').amsifySuggestags({
        type: 'amsify',
    });

    initMap();

    if (localStorage.getItem("oid") != null) {

        oid = localStorage.getItem("oid");
        getManageLocation(oid);
        localStorage.setItem("oid", null);

    }

    $('#locationTable').on('click', '.btn-primary', function() {
        console.log('edit');
        oid = $(this).data('oid');
        getManageLocation(oid);

    })

    $('#saveLocation').on('click', function() {
        data = {
            'oid': null,
            'name': null,
            'previous_name': [],
            'first_date': null,
            'geo': null
        };
        data['oid'] = $('#locationForm input[name="oid"]').val();
        data['name'] = $('#locationForm input[name="name"]').val();
        data['previous_name'] = $('#locationForm input[name="previous_name"]').val().split(',');
        data['first_date'] = $('#locationForm input[name="first_date"]').val();
        data['geo'] = getMarkers();

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
            $('#cardTitle').text("Nuova località");
            /*if (!isedit) {
                $('#locationTable').append("<tr><td>" + doc['name'] + "</td><td><button type='button' class='btn btn-primary' data-oid=" + doc['oid'] + "><span class='oi oi-pencil'></span></button></td></tr>");
            } else {
                isedit = false;*/
            updateTable();
            //  }
            $('#locationForm input[name="oid"]').val(null);
            $('#locationForm').trigger('reset');
            $('input[name="previous_name"]').amsifySuggestags({ type: 'amsify', }, 'refresh');
            removeMarkers();
        });


    })
    $('#cancelLocation').on('click', function() {
        r = confirm("Vuoi davvero cancellare tutte le modifiche?");
        if (r == true) {
            a = $('#locationForm input[name="oid"]').val();

            $('#locationForm').trigger('reset');
            if (a != null) {
                $('#locationForm input[name="oid"]').val(a);
            }
            $('input[name="previous_name"]').amsifySuggestags({ type: 'amsify', }, 'refresh');
            removeMarkers();

        }
    });
});

function updateTable() {
    $('#locationTable').load(window.location.href + " #locationTable");
}

function getManageLocation(oid) {
    $.ajax({
        url: "./manageLocation/",
        method: 'GET',
        data: { 'oid': oid },

    }).done(function(response) {
        console.log(response);
        isedit = true;
        doc = response['doc'];
        $('#cardTitle').text("Modifica località: <<" + doc['name'] + ">>");
        $('#locationForm input[name="oid"]').val(doc['_id']['$oid']);
        $('#locationForm input[name="name"]').val(doc['name']);
        if (doc['previous_name'].length) {
            $('#locationForm input[name="previous_name"]').val(doc['previous_name'].join());
            $('input[name="previous_name"]').amsifySuggestags({ type: 'amsify', }, 'refresh');
        }
        $('#locationForm input[name="first_date"]').val(doc['first_date']);
        if (doc['geo']) {
            removeMarkers();
            if (doc['geo']['type'] == 'Point') {
                c = doc['geo']['coordinates'];
                // var marker = L.marker([c[0], c[1]]).addTo(map);
                var marker = drawnItems.addLayer(L.marker([c[0], c[1]]));
                map.panTo(new L.LatLng(c[0], c[1]));
                //map.setZoom(11);
                //map.setView(new L.LatLng(c[0], c[1]), 15);
                enableDraw(false);
            }
            if (doc['geo']['type'] == 'Polygon') {
                c = doc['geo']['coordinates'];
                console.log(c);
                var polygon = drawnItems.addLayer(L.polygon(c)); //.addTo(map);
                map.panTo(new L.LatLng(c[0][0][0], c[0][0][1]));
                //map.setZoom(11);
                // map.setView(new L.LatLng(c[0][0][0], c[0][0][1]), 15);
                // map.fitBounds(polygon.getBounds());
                enableDraw(false);
            }
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
                allowIntersection: false,
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