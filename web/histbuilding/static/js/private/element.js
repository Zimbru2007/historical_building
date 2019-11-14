newElementId = 1;
var fonteid;
var fontename;
$(document).ready(function() {

    fontename = "";
    fonteid = getUrlVars()["fonteid"];
    if (fonteid) {
        $.ajax({
            url: "/private/fonti/listSources/",
            method: 'GET',
            data: { 'oid_required': fonteid },

        }).done(function(response) {
            console.log(response);
            doc = response['doc'];
            for (var key in doc) {

                if (key != '_id') {
                    fontename = fontename + key + " : " + doc[key] + "; ";
                }
            }
            console.log(fontename);

            addFormElement(true);
        });
    } else {
        addFormElement(false);
    }


    $('#btnsaveTrans').on('click', function() {});

});

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function addFormElement(is_existing) {

    $.get("/static/templates/formSourceElement.html", function(data) {
        t = $.parseHTML(data)[0];
        console.log(t.content);
        t.content.querySelector('.fonteoid-input').setAttribute("name", "fonteoid-" + newElementId);
        t.content.querySelector('.fonteoid-input').setAttribute("value", fonteid);
        t.content.querySelector('.fonte-input').setAttribute("name", "fonte-" + newElementId);
        t.content.querySelector('.fonte-input').setAttribute("id", "fonte-" + newElementId);
        t.content.querySelector('.fonte-input').setAttribute("value", fontename);
        if (is_existing) {
            t.content.querySelector('.fonte-input').setAttribute("readonly", "readonly");
        } else {
            t.content.querySelector('.fonte-input').removeAttribute("readonly");
        }
        t.content.querySelector('.city-input').setAttribute("name", "city-" + newElementId);
        t.content.querySelector('.city-input').setAttribute("id", "city-" + newElementId);
        t.content.querySelector('.building-input').setAttribute("name", "building-" + newElementId);
        t.content.querySelector('.source-input').setAttribute("name", "source-" + newElementId);
        // t.content.querySelector('.order-input').setAttribute("value", newElementId);
        t.content.querySelector('.elemA-input').setAttribute("name", "elemA-" + newElementId);
        t.content.querySelector('.elemB-input').setAttribute("name", "elemB-" + newElementId);
        t.content.querySelector('.elemC-input').setAttribute("name", "elemC-" + newElementId);
        t.content.querySelector('.elemD-input').setAttribute("name", "elemD-" + newElementId);
        t.content.querySelector('.elemE-input').setAttribute("name", "elemE-" + newElementId);
        t.content.querySelector('.elemF1-input').setAttribute("name", "elemF1-" + newElementId);
        t.content.querySelector('.elemF2-input').setAttribute("name", "elemF2-" + newElementId);
        t.content.querySelector('.elemF1text-input').setAttribute("name", "elemF1text-" + newElementId);
        t.content.querySelector('.elemF2text-input').setAttribute("name", "elemF2text-" + newElementId);

        var clone = document.importNode(t.content, true);
        $('#formElement').append(clone);
        $('input[name="fonte-1"]').typeahead({
            onSelect: function(item) {
                console.log(item);
                $('#formElement input[name="fonte-1"]').val(item.value);
                /*$('#manageBuilding').show();
                $('#buildingForm input[name="locationid"]').val(item.value);
                $('input[name="location"]').prop('disabled', 'disabled');
                $('#changeLocation').show();

                if (initMapFlag) {
                    initMap();
                    initMapFlag = false;
                }
                updateLocationEntities(item['value']);*/
            },
            ajax: {
                url: '/private/fonti/listSources/',
                displayField: "name",
                triggerLength: 1,
                preProcess: function(data) {
                    listLocations = [];
                    console.log(data);
                    for (var i = 0; i < data['docs'].length; i++) {
                        name = "";
                        for (var key in data['docs'][i]) {

                            if (key != '_id') {
                                name = name + key + " : " + data['docs'][i][key] + "; ";
                            }
                        }
                        listLocations.push({ 'id': data['docs'][i]['_id']['$oid'], 'name': name });
                    }
                    return listLocations;
                }
            }
        });

        $('input[name="city-1"]').typeahead({
            onSelect: function(item) {
                console.log(item);

                $('input[name="city-1"]').val(item.value);

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
                    console.log(listLocations);
                    return listLocations;
                }
            }
        });
        newElementId += 1;

    });



}