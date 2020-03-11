var sourcetable;
newElementId = 1;
var val;
var curr_source;
$(document).ready(function() {
    sourcetable = $('#sourcesTable').DataTable();


    $('#sourceType').on('change', function() {
        val = $(this).val();
        if (val != "0") {
            $('.saveButton').prop("disabled", true);
            $('#cardSources').show();
            $('.formSource').hide();
            $('#' + val).show();
            $('#' + val + ' input[name="oid"]').val(null);
            $('#' + val + ' input[name="newElement"]').hide();
            $('#' + val).trigger('reset');
            sourcetable.destroy();
            checkRequiredFields(val);
            updateSourceEntities(val);
        } else {
            $('#cardSources').hide();
            $('.formSource').hide();
        }
    });



    $('#sourcesTable').on('click', '.btn-primary', function() {
        oid = $(this).data('oid');
        curr_source = oid;
        editSources(oid);

    })

    $('.saveButton').on('click', function() {
        saveForm();

    })

    $('.newElement').on('click', function() {
        $('#divElement').show();
        location.replace('/private/elementi/?fonteid=' + curr_source);
    })
});

function checkRequiredFields(val) {
    $('#' + val + ' input[required]').change(function() {
        countRequiredFields(val);
    });
}

function countRequiredFields(val) {
    var valid = true;
    $.each($('#' + val + ' input[required]'), function(index, value) {
        if (!$(value).val()) {
            valid = false;
        }
    });
    if (valid) {
        $('#' + val + ' input[name="saveButton"]').prop("disabled", false);
    } else {
        $('#' + val + ' input[name="saveButton"]').prop("disabled", true);
    }
}

function updateSourceEntities(oid) {
    $.ajax({
        url: "./listSources/",
        method: 'GET',
        data: { 'sourcetype': oid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        docs = response['docs'];
        doc = response['doc'];

        has_required = false;
        $('#sourcesTable thead tr').empty();
        for (var key in doc) {
            $('#sourcesTable thead tr').append("<th>" + gettext(key) + "</th>")
            has_required = true;
        }
        if (!has_required) {
            $('#sourcesTable thead tr').append("<th>id</th>")
        }
        $('#sourcesTable thead tr').append("<th>" + gettext("Modifica") + "</th>")

        $('#sourcesTable tbody').empty();
        for (var i = 0; i < docs.length; i++) {

            $('#sourcesTable tbody').append("<tr id='sourcetable" + i + "'> </tr> ");
            if (has_required) {
                for (var key in doc) {
                    $('#sourcetable' + i).append("<td>" + docs[i][key] + "</td>");
                }
            } else {
                $('#sourcetable' + i).append("<td>" + i + "</td>");
            }
            $('#sourcetable' + i).append("<td><button type='button' class='btn btn-primary' data-oid='" + docs[i]['_id']['$oid'] + "'><span class='oi oi-pencil'></span></button></td>");

        }
        sourcetable = $('#sourcesTable').DataTable();
    });
}

function editSources(oid) {
    $.ajax({
        url: "./listSources/",
        method: 'GET',
        data: { 'oid': oid },

    }).done(function(response) {
        doc = response['doc'];
        for (var key in doc) {
            $('#' + val + ' input[name="' + key + '"]').val(doc[key]);
        }
        countRequiredFields(val);
        $('#' + val + ' input[name="oid"]').val(doc['_id']['$oid']);
        $('#' + val + ' input[name="SourceType"]').val(doc['SourceType']['$oid']);
        $('#' + val + ' input[name="newElement"]').show();
    });
}



function saveForm() {

    formData = $('#' + val).serializeArray();

    data = {}
    for (var i = 0; i < formData.length; i++) {
        el = formData[i];
        if (el['value'] != "") {
            data[el['name']] = el['value'];
        }
    }

    $.ajax({
        url: "./listSources/",
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        toastr["success"](response['message']);
        doc = response['doc'];
        r = confirm(gettext("Vuoi inserire nuove elementi su questa fonte?"));
        if (r == true) {
            location.replace('/private/elementi/?fonteid=' + doc["oid"]);
        } else {
            sourcetable.destroy();
            updateSourceEntities(val);
            curr_source = doc["oid"];
            $('#' + val + ' input[name="newElement"]').show();
        }
    })

    ;
}