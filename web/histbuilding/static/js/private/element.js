newElementId = 1;
var fonteid;
var fontename;
$(document).ready(function() {

    $('#elementType').on('change', function() {
        val = $(this).val();
        updateElementForm(val);
        //
    });

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

            selectFontiECitta(true);
        });
    } else {
        selectFontiECitta(false);
    }


    $('#btnsaveTrans').on('click', function() {});

});

function updateElementForm(element_typeid) {
    $.ajax({
        url: "/private/configurazione/defineFormElement/",
        method: 'GET',
        data: { 'oid': element_typeid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        console.log(response);
        element = response['element'];
        console.log(element['elements']);
        elhtml = '<div class="card mt-3 formel"><div class="card-body"><h5 class="card-title">' + element['name'] + '</h5><div class="form-group" id="elem-' + newElementId + '"></div></div></div>';
        $('#elemPart').append(elhtml);
        console.log(elhtml);
        for (var i = 0; i < element['elements'].length; i++) {
            elhtml = '<div class="form-group">';
            required = '';
            requiredtext = '';
            console.log(element['elements']);

            if (element['elements'][i]['required']) {
                required = '*';
                requiredtext = 'required';
            }
            if (element['elements'][i]['type'] == 'text') {
                elhtml = elhtml + '<label>' + element['elements'][i]['name'] + required + '</label>';
                elhtml = elhtml + '<input type="text" name="' + element['elements'][i]['name'] + '" placeholder="' + element['elements'][i]['name'] + '" class="form-control" ' + requiredtext + '>';
                //$('#elem-' + newElementId).append(elhtml);
            }
            if (element['elements'][i]['type'] == 'textarea') {
                elhtml = elhtml + '<label>' + element['elements'][i]['name'] + required + '</label>';
                elhtml = elhtml + '<textarea name="' + element['elements'][i]['name'] + '" placeholder="' + element['elements'][i]['name'] + '" class="form-control" row="3" ' + requiredtext + '></textarea>';
                // $('#elem-' + newElementId).append(elhtml);
            }
            if (element['elements'][i]['type'] == 'number') {
                elhtml = elhtml + '<label>' + element['elements'][i]['name'] + required + '</label>';
                elhtml = elhtml + '<input type="number" name="' + element['elements'][i]['name'] + '" placeholder="' + element['elements'][i]['name'] + '" class="form-control" ' + requiredtext + '>';
                //  $('#elem-' + newElementId).append(elhtml);
            }
            if (element['elements'][i]['type'] == 'date') {
                elhtml = elhtml + '<label>' + element['elements'][i]['name'] + required + '</label>';
                elhtml = elhtml + '<input type="text" name="' + element['elements'][i]['name'] + '" placeholder="' + element['elements'][i]['name'] + '" class="form-control datecontrol" ' + requiredtext + 'pattern="(0[1-9]|1[0-9]|2[0-9]|3[01])/(0[1-9]|1[012])/[0-9]{4}">';
                // $('#elem-' + newElementId).append(elhtml);
            }
            if (element['elements'][i]['type'] == 'boolean') {
                elhtml = elhtml + element['elements'][i]['name'] + required;
                elhtml = elhtml + '<label class="switch ml-2">';
                elhtml = elhtml + '<input type="checkbox" class="default" name="' + element['elements'][i]['name'] + '"' + requiredtext + '>';
                elhtml = elhtml + '<span class="slider round" ></span></label>';
                //$('#elem-' + newElementId).append(elhtml);
            }
            elhtml = elhtml + '</div>';
            console.log(elhtml);
            $('#elem-' + newElementId).append(elhtml);
            //elhtml = '</div></div></div>';
            // $('#elemPart').append(elhtml);
        }
        newElementId += 1;
    });
}

function selectFontiECitta(is_existing) {
    console.log("is_existing" + is_existing);
    if (is_existing) {
        $('#fontelist').prop('readonly', true);
    } else {
        $('#fontelist').prop('readonly', false);
    }
    $('#fontelist').typeahead({
        onSelect: function(item) {
            console.log(item);
            $('#fonteidlist').val(item.value);
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
                            name = name + data['docs'][i][key] + " ";
                        }
                    }
                    listLocations.push({ 'id': data['docs'][i]['_id']['$oid'], 'name': name });
                }
                return listLocations;
            }
        }
    });
    $('#citta').typeahead({
        onSelect: function(item) {
            console.log(item);

            $('#cittaid').val(item.value);
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
    $('#palazzo').typeahead({
        onSelect: function(item) {
            console.log(item);

            $('#palazzoid').val(item.value);

        },
        ajax: {
            url: '/private/palazzi/manageBuilding/',
            displayField: "name",
            triggerLength: 1,
            preDispatch: function(query) {
                cittaid = "";
                if ($('#citta').val() != "") {
                    cittaid = $('#cittaid').val();
                }
                return {
                    search: query,
                    searchlocationid: cittaid
                }
            },
            preProcess: function(data) {
                listBuildings = [];
                console.log(data);
                for (var i = 0; i < data['docs'].length; i++) {
                    listBuildings.push({ 'id': data['docs'][i]['_id']['$oid'], 'name': data['docs'][i]['name'] });
                }
                console.log(listBuildings);
                return listBuildings;
            }
        }
    });
}

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

        newElementId += 1;

    });



}