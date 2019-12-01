newElementId = 1;
var fonteid;
var fontename;
var fontilist = [];
$(document).ready(function() {

    /*listTags = $('#fontelist').amsifySuggestags({
        type: 'amsify',
        suggestionsAction: {
            url: '/private/fonti/listSources/'
        }
        // suggestions: ['Black', 'White', 'Red', 'Blue', 'Green', 'Orange'],
    });*/

    $('#elementType').on('change', function() {
        val = $(this).val();
        updateElementForm(val);
        //
    });

    $('#btnsaveElem').on('click', function() {
        saveForm();
        //$('#saveButton').val('test');
    })


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
        elhtml = '<div class="card mt-3 formel"><div class="card-body"><h5 class="card-title">' + element['name'] + '</h5><div class="form-group" id="elem-' + newElementId + '">';
        elhtml = elhtml + '<input type="hidden" name="element_id-' + newElementId + '"  class="form-control" value="' + element_typeid + '">';
        elhtml = elhtml + '</div></div></div>';
        $('#elemPart').append(elhtml);
        console.log(elhtml);
        for (var i = 0; i < element['elements'].length; i++) {
            elhtml = '<div class="form-group">';
            required = '';
            requiredtext = '';
            if (element['elements'][i]['required']) {
                required = '*';
                requiredtext = 'required';
            }
            if (element['elements'][i]['type'] == 'text') {
                elhtml = elhtml + '<label>' + element['elements'][i]['name'] + required + '</label>';
                elhtml = elhtml + '<input type="text" name="' + gettext(element['elements'][i]['name']) + '-' + newElementId + '" placeholder="' + element['elements'][i]['name'] + '" class="form-control" ' + requiredtext + '>';
                //$('#elem-' + newElementId).append(elhtml);
            }
            if (element['elements'][i]['type'] == 'textarea') {
                elhtml = elhtml + '<label>' + element['elements'][i]['name'] + required + '</label>';
                elhtml = elhtml + '<textarea name="' + element['elements'][i]['name'] + '-' + newElementId + '" placeholder="' + element['elements'][i]['name'] + '" class="form-control" row="3" ' + requiredtext + '></textarea>';
                // $('#elem-' + newElementId).append(elhtml);
            }
            if (element['elements'][i]['type'] == 'number') {
                elhtml = elhtml + '<label>' + element['elements'][i]['name'] + required + '</label>';
                elhtml = elhtml + '<input type="number" name="' + element['elements'][i]['name'] + '-' + newElementId + '" placeholder="' + element['elements'][i]['name'] + '" class="form-control" ' + requiredtext + '>';
                //  $('#elem-' + newElementId).append(elhtml);
            }
            if (element['elements'][i]['type'] == 'date') {
                elhtml = elhtml + '<label>' + element['elements'][i]['name'] + required + '</label>';
                elhtml = elhtml + '<input type="text" name="' + element['elements'][i]['name'] + '-' + newElementId + '" placeholder="' + element['elements'][i]['name'] + '" class="form-control datecontrol" ' + requiredtext + 'pattern="(0[1-9]|1[0-9]|2[0-9]|3[01])/(0[1-9]|1[012])/[0-9]{4}">';
                // $('#elem-' + newElementId).append(elhtml);
            }
            if (element['elements'][i]['type'] == 'boolean') {
                elhtml = elhtml + element['elements'][i]['name'] + required;
                elhtml = elhtml + '<label class="switch ml-2">';
                elhtml = elhtml + '<input type="checkbox" class="default" name="' + element['elements'][i]['name'] + '-' + newElementId + '"' + requiredtext + '>';
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
        $("#elementType option:eq(0)").prop('selected', true);
    });
}

function selectFontiECitta(is_existing) {
    console.log("is_existing" + is_existing);
    if (is_existing) {
        $('#fontelist').prop('readonly', true);
    } else {
        $('#fontelist').prop('readonly', false);
    }
    $.ajax({
        url: "/private/fonti/listSources/",
        method: 'GET',
        data: { 'suggestquery': 'suggestquery' },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        console.log(response);
        docs = response['docs'];
        console.log(docs);
        suggestionswithidlist = {};
        suggestionslist = [];
        for (var i = 0; i < docs.length; i++) {
            sug = {}
            tag = "";
            for (var key in docs[i]) {
                if (key != "_id") {
                    tag += docs[i][key] + " ";
                }
            }

            suggestionswithidlist[tag] = docs[i]["_id"];
            //sug["tag"] = tag;
            //suggestionswithidlist.push(sug);
            suggestionslist.push(tag);

        }
        fontilist = [];
        console.log(suggestionswithidlist);
        listTags = $('#fontelist').amsifySuggestags({
            type: 'amsify',
            suggestions: suggestionslist,
            whiteList: true,
            afterAdd: function(value) {
                //console.info(value); // Parameter will be value
                fontilist.push(suggestionswithidlist[value]["$oid"]);
                console.info(fontilist);
                $('#fonteidlist').val(fontilist);
            },
            afterRemove: function(value) {
                //console.info(value); // Parameter will be value
                fontilist.splice(fontilist.indexOf(suggestionswithidlist[value]["$oid"]), 1);
                console.info(fontilist);
                $('#fonteidlist').val(fontilist);
            },
        });
    });

    /* $('#fontelist').typeahead({
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
     });*/
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


function saveForm() {
    formData = $('#formElement').serializeArray();

    data = {}
    data["fonteidlist"] = fontilist;
    for (var i = 0; i < formData.length; i++) {
        el = formData[i];
        //if (el['value'] != "") {
        if (el['name'].indexOf('-') != -1) {
            idEl = el['name'].split("-")[1];
            feature = el['name'].split("-")[0]
            keyEl = 'el-' + idEl;
            if (keyEl in data == false) {
                data[keyEl] = {}
            }
            data[keyEl][feature] = el['value'];
        } else {
            if (el['name'] == "palazzoid") {
                data[el['name']] = el['value'];
            } else if (el['name'] == "fonteidlist") {

            }
        }
        // }
    }
    console.log(formData);
    console.log(data);
    // alert("formData " + JSON.stringify(data));
    $.ajax({
            url: "./manageElements/",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function(response) {
            window.location.href = "/private/elenco_elementi";

            /*toastr["success"](response['message']);
            doc = response['doc'];

            r = confirm("Vuoi inserire nuove elementi su questa fonte?");
            if (r == true) {
                location.replace('/private/elementi/?fonteid=' + doc["oid"]);
            } else {
                sourcetable.destroy();
                updateSourceEntities(val);
                curr_source = doc["oid"];
                $('#newElement').show();
            }*/
        })
        /*.fail(function(xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        })*/
    ;
}