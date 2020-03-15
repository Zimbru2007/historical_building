newElementId = 1;
var fonteid;
var elementid;
var fontename;
var fontilist = [];
var suggestionswithidlist2 = {};
var suggestionswithidlist = {};
var initelemid = false;
suggestionslist = [];

$(document).ready(function() {

    $('#btnsaveElem').prop("disabled", true);
    checkRequiredFields();

    $('#elementType').on('change', function() {
        val = $(this).val();
        updateElementForm(val);
    });

    $('#btnsaveElem').on('click', function() {
        saveForm();
    })
    selectFontiECitta();

    fontename = "";
    fonteid = getUrlVars()["fonteid"];
    elementid = getUrlVars()["elementid"];


    if (elementid) {
        initelemid = true;
    }

});

function checkRequiredFields() {
    $('#formElement input[required]').change(function() {
        countRequiredFields();
    });
}

function countRequiredFields() {
    var valid = true;
    var n = 0;
    $.each($('#formElement input[required]'), function(index, value) {
        n++;
        if (!$(value).val()) {
            valid = false;
        }
    });
    if (valid) {
        $('#btnsaveElem').prop("disabled", false);
    } else {
        $('#btnsaveElem').prop("disabled", true);
    }
}

function updateElementForm(element_typeid) {
    $.ajax({
        url: "/private/configurazione/defineFormElement/",
        method: 'GET',
        data: { 'oid': element_typeid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        element = response['element'];
        elhtml = '<div class="card mt-3 formel" id="card-' + newElementId + '"><div class="card-body"><h5 class="card-title">' + gettext(element['name']) + '</h5><div class="form-group" id="elem-' + newElementId + '">';
        elhtml = elhtml + '<input type="hidden" name="element_id-' + newElementId + '"  class="form-control" value="' + element_typeid + '">';
        elhtml = elhtml + '</div></div></div>';
        $('#elemPart').append(elhtml);
        buthtml = '<div class="text-right"><button type="button" class="btn btn-danger" id="btn-' + newElementId + '" data-oid="' + newElementId + '"><span class="oi oi-x"></span></button></div>';
        $('#elem-' + newElementId).append(buthtml);

        for (var i = 0; i < element['elements'].length; i++) {
            elhtml = '<div class="form-group">';
            required = '';
            requiredtext = '';
            if (element['elements'][i]['required']) {
                required = '*';
                requiredtext = 'required';
            }
            if (element['elements'][i]['type'] == 'text') {
                elhtml = elhtml + '<label>' + gettext(element['elements'][i]['name']) + required + '</label>';
                elhtml = elhtml + '<input type="text" name="' + element['elements'][i]['name'] + '-' + newElementId + '" placeholder="' + gettext(element['elements'][i]['name']) + '" class="form-control" ' + requiredtext + '>';
            }
            if (element['elements'][i]['type'] == 'textarea') {
                elhtml = elhtml + '<label>' + gettext(element['elements'][i]['name']) + required + '</label>';
                elhtml = elhtml + '<textarea name="' + element['elements'][i]['name'] + '-' + newElementId + '" placeholder="' + gettext(element['elements'][i]['name']) + '" class="form-control" row="3" ' + requiredtext + '></textarea>';
            }
            if (element['elements'][i]['type'] == 'number') {
                elhtml = elhtml + '<label>' + gettext(element['elements'][i]['name']) + required + '</label>';
                elhtml = elhtml + '<input type="number" name="' + element['elements'][i]['name'] + '-' + newElementId + '" placeholder="' + gettext(element['elements'][i]['name']) + '" class="form-control" ' + requiredtext + '>';
            }
            if (element['elements'][i]['type'] == 'date') {
                elhtml = elhtml + '<label>' + gettext(element['elements'][i]['name']) + required + '</label>';
                elhtml = elhtml + '<input type="text" name="' + element['elements'][i]['name'] + '-' + newElementId + '" placeholder="' + gettext(element['elements'][i]['name']) + '" class="form-control datecontrol" ' + requiredtext + 'pattern="(0[1-9]|1[0-9]|2[0-9]|3[01])/(0[1-9]|1[012])/[0-9]{4}">';
            }
            if (element['elements'][i]['type'] == 'boolean') {
                elhtml = elhtml + gettext(element['elements'][i]['name']) + required;
                elhtml = elhtml + '<label class="switch ml-2">';
                elhtml = elhtml + '<input type="checkbox" class="default" name="' + element['elements'][i]['name'] + '-' + newElementId + '"' + requiredtext + '>';
                elhtml = elhtml + '<span class="slider round" ></span></label>';
            }
            elhtml = elhtml + '</div>';

            $('#elem-' + newElementId).append(elhtml);

        }

        $('#btn-' + newElementId).on('click', function() {
            oid = $(this).data('oid');
            $('#card-' + oid).remove();
            countRequiredFields();

        });
        newElementId += 1;
        $("#elementType option:eq(0)").prop('selected', true);
        if (initelemid) {
            $.ajax({
                url: "/private/elenco_elementi/manageListElements/",
                method: 'GET',
                data: { 'elementid': elementid },

            }).done(function(response) {
                doc = response['element'];

                for (var key in doc['element']) {
                    if (key != 'element_id') {
                        $('#formElement input[name="' + key + '-1"]').val(doc['element'][key]);
                        if ($('#formElement input[name="' + key + '-1"]').attr('type') == 'checkbox') {
                            if (doc['element'][key] == 'on') {
                                $('#formElement input[name="' + key + '-1"]').prop('checked', true);
                            }
                        }
                    } else {
                        $('#formElement input[name="' + key + '-1"]').val(doc['element'][key]['$oid']);
                    }
                }
                checkRequiredFields();
                countRequiredFields();
            });
            initelemid = false;
        }
        checkRequiredFields();
        countRequiredFields();
    });

}

function editForm2() {

    fontenames = suggestionswithidlist2[fonteid];
    $('#fontelist').val(fontenames);
    $('#fontelist').amsifySuggestags({
        type: 'amsify',
        suggestions: suggestionslist,
        whiteList: true,
        afterAdd: function(value) {
            fontilist.push(suggestionswithidlist[value]);
            $('#fonteidlist').val(fontilist);
        },
        afterRemove: function(value) {
            fontilist.splice(fontilist.indexOf(suggestionswithidlist[value]), 1);
            $('#fonteidlist').val(fontilist);
        }
    }, 'refresh');
    countRequiredFields();
}

function editForm() {
    $.ajax({
        url: "/private/elenco_elementi/manageListElements/",
        method: 'GET',
        data: { 'elementid': elementid },

    }).done(function(response) {
        doc = response['element'];
        updateElementForm(doc['element']['element_id']['$oid']);
        var fontenames = [];
        for (var j = 0; j < doc['fonteidlist'].length; j++) {
            fontenames.push(suggestionswithidlist2[doc['fonteidlist'][j]]);

        }
        $('#fontelist').val(fontenames.join());
        $('#fontelist').amsifySuggestags({
            type: 'amsify',
            suggestions: suggestionslist,
            whiteList: true,
            afterAdd: function(value) {
                fontilist.push(suggestionswithidlist[value]);
                $('#fonteidlist').val(fontilist);
            },
            afterRemove: function(value) {
                fontilist.splice(fontilist.indexOf(suggestionswithidlist[value]), 1);
                $('#fonteidlist').val(fontilist);
            }
        }, 'refresh');

        $('#citta').val(doc['locationname']);
        $('#cittaid').val(doc['locationid']['$oid']);
        $('#palazzo').val(doc['buildingname']);
        $('#palazzoid').val(doc['palazzoid']['$oid']);

    });

}

function selectFontiECitta() {

    $.ajax({
        url: "/private/fonti/listSources/",
        method: 'GET',
        data: { 'suggestquery': 'suggestquery' },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        docs = response['docs'];
        suggestionswithidlist = {};
        suggestionswithidlist2 = {};
        suggestionslist = [];
        for (var i = 0; i < docs.length; i++) {
            sug = {}
            tag = "";
            for (var key in docs[i]) {
                if (key != "_id") {
                    tag += docs[i][key] + " ";
                }
            }
            var res = tag.replace(",", ";");
            var trimtag = $.trim(res);

            suggestionswithidlist[trimtag] = docs[i]["_id"]["$oid"];
            suggestionswithidlist2[docs[i]["_id"]["$oid"]] = trimtag;
            suggestionslist.push(trimtag);

        }
        fontilist = [];
        listTags = $('#fontelist').amsifySuggestags({
            type: 'amsify',
            suggestions: suggestionslist,
            whiteList: true,
            afterAdd: function(value) {
                fontilist.push(suggestionswithidlist[value]);
                $('#fonteidlist').val(fontilist);
            },
            afterRemove: function(value) {
                fontilist.splice(fontilist.indexOf(suggestionswithidlist[value]), 1);
                $('#fonteidlist').val(fontilist);
            }
        });
        if (elementid) {
            editForm();

        }
        if (fonteid) {
            editForm2();
        }
    });


    $('#citta').typeahead({
        onSelect: function(item) {
            $('#cittaid').val(item.value);
            $('#palazzoid').val("");
            $('#palazzo').val("");
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
    $('#palazzo').typeahead({
        onSelect: function(item) {
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
                for (var i = 0; i < data['docs'].length; i++) {
                    listBuildings.push({ 'id': data['docs'][i]['_id']['$oid'], 'name': data['docs'][i]['name'] });
                }
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



function saveForm() {
    formData = $('#formElement').serializeArray();

    data = {}
    data["fonteidlist"] = fontilist;
    for (var i = 0; i < formData.length; i++) {
        el = formData[i];
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
            }
        }
    }
    if (elementid) {
        data['_id'] = elementid;

    }
    $.ajax({
        url: "./manageElements/",
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        window.location.href = "/private/elenco_elementi";


    });
}