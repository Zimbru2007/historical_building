var sourcetable;
newElementId = 1;
var val;
var curr_source;
$(document).ready(function() {
    sourcetable = $('#sourcesTable').DataTable();


    $('#sourceType').on('change', function() {
        console.log($(this).val());
        val = $(this).val();
        $('.formSource').hide();
        $('#' + val).show();
        sourcetable.destroy();
        updateSourceEntities(val);
    });

    $('#sourcesTable').on('click', '.btn-primary', function() {
        console.log('edit');
        oid = $(this).data('oid');
        curr_source = oid;
        editSources(oid);

    })

    $('#saveButton').on('click', function() {
        saveForm();
        //$('#saveButton').val('test');
    })

    $('#newElement').on('click', function() {
        $('#divElement').show();
        //addFormElement();
        location.replace('/private/elementi/?fonteid=' + curr_source);
    })
});

function addFormElement() {
    $.get("/static/templates/formSourceElement.html", function(data) {
        t = $.parseHTML(data)[0];
        console.log(t.content.querySelector('.city-input'));
        t.content.querySelector('.city-input').setAttribute("name", "city-" + newElementId);
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

function updateSourceEntities(oid) {
    $.ajax({
        url: "./listSources/",
        method: 'GET',
        data: { 'sourcetype': oid },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        console.log(response);
        docs = response['docs'];
        doc = response['doc'];

        /*$('#sourcesTable').DataTable({
            "ajax": docs
        });*/

        has_required = false;
        $('#sourcesTable thead tr').empty();
        for (var key in doc) {
            $('#sourcesTable thead tr').append("<th>" + key + "</th>")
            has_required = true;
        }
        if (!has_required) {
            $('#sourcesTable thead tr').append("<th>id</th>")
        }
        $('#sourcesTable thead tr').append("<th>Modifica</th>")

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
        console.log(response);
        doc = response['doc'];
        for (var key in doc) {
            $('#' + val + ' input[name="' + key + '"]').val(doc[key]);
        }
        //$('#locationForm input[name="name"]').val(doc['name']);
        // alert(temp);
        // alert("3344autoriddd " + doc['autori'] + doc['_id']['$oid']);
        // $('#cardTitle').text("Modifica località: <<" + doc['name'] + ">>");
        $('#' + val + ' input[name="oid"]').val(doc['_id']['$oid']);
        $('#' + val + ' input[name="SourceType"]').val(doc['SourceType']['$oid']);
        $('#newElement').show();
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
    // alert("formData " + JSON.stringify(data));
    $.ajax({
            url: "./listSources/",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function(response) {
            toastr["success"](response['message']);
            doc = response['doc'];
            r = confirm("Vuoi inserire nuove elementi su questa fonte?");
            if (r == true) {
                location.replace('/private/elementi/?fonteid=' + doc["oid"]);
            } else {
                sourcetable.destroy();
                updateSourceEntities(val);
                curr_source = doc["oid"];
                $('#newElement').show();
            }
        })
        /*.fail(function(xhr, textStatus, errorThrown) {
            console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);
        })*/
    ;
}