newElementId = 1;
curroid = "";

$(document).ready(function() {

    $('#newSourceType').on('click', function() {
        $('#divSourceType').show();
        $('.formel').remove();
        $('input[name="name"]').val('');
        curroid = '';
        newElementId = 1;
        $(this).hide();
        $('#saveForm').show();
        $('#cancelForm').show();
        $('#updateForm').hide();

    });

    $('#tableSources').on('click', '.btn-primary', function() {
        console.log('edit fonte');
        oid = $(this).data('oid');
        curroid = oid;
        // alert('edit fonte ' + oid);
        $.ajax({
                url: "./defineFormSource/",
                method: 'GET',
                data: { 'oid': oid }

            }).done(function(response) {
                //console.log(response);
                source = response['source'];
                //addFormElement();
                maxElementId = 1;
                // $('#formSourceType').empty();
                //$('#formElemSourceType').empty();
                $('#divSourceType').show();
                $('.formel').remove();

                $('#newSourceType').hide();
                $('#updateForm').show();
                $('#cancelForm').show();
                $('#saveForm').hide();
                $('input[name="name"]').val(source['name']);
                for (var i = 0; i < source['elements'].length; i++) {
                    addEditFormElement(source['elements'][i]);
                    //str = str + " " + source['elements'][i]['type'];
                    tempElemntId = parseInt(source['elements'][i]['order']);
                    if (maxElementId <= tempElemntId) {
                        maxElementId = tempElemntId + 1;
                    }
                }
                newElementId = maxElementId;
            })
            /*.fail(function(xhr, textStatus, errorThrown) {
                    })*/
        ;

    });

    $('#addElForm').on('click', function() {
        addFormElement()
    });

    $('#saveForm').on('click', function() {
        saveForm();
        $('#divSourceType').hide();
        $(this).hide();
        $('#cancelForm').hide();
        $('#updateForm').hide();
        $('#newSourceType').show();
    });

    $('#updateForm').on('click', function() {
        saveForm();
        $('#divSourceType').hide();
        $(this).hide();
        $('#cancelForm').hide();
        $('#saveForm').hide();
        $('#newSourceType').show();
    });

    $('#cancelForm').on('click', function() {
        r = confirm("Vuoi davvero cancellare tutte le modifiche?");
        if (r == true) {
            $(this).hide();
            $('#updateForm').hide();
            $('#saveForm').hide();
            $('#divSourceType').hide();
            $('#newSourceType').show();
        }

        /*saveForm();
        $('#divSourceType').hide();
        $(this).hide();
        $('#newSourceType').show();*/
    });

    $('#btnSearchTrans').on('click', function() {
        $.ajax({
            url: "./editTranslation/",
            method: 'GET',
            data: { 'query': $('input[name="search_string"]').val() }
        }).done(function(response) {
            $('#tableTransRes').hide();
            $('#alertNoresult').hide();
            $('#tableTransRes tbody').empty();
            $('#resultTrans').show();
            docs = response['docs']
            if (docs.length == 0) {
                $('#alertNoresult').show();
            } else {

                for (var i = 0; i < docs.length; i++) {
                    $('#tableTransRes tbody').append("<tr><td>" + docs[i]['message'] + "</td><td><button data-oid='" + docs[i]['_id']['$oid'] + "' class='btn btn-primary'><span class='oi oi-pencil'></span></button></td> ");
                }
                $('#tableTransRes').show();
            }

        });

    });


    $('#tableTransRes').on('click', '.btn-primary', function() {
        oid = $(this).data('oid')
        $.ajax({
            url: "./editTranslation/",
            method: 'GET',
            data: { 'oid': oid }
        }).done(function(response) {
            doc = response['doc'];
            $('#resultTrans').hide();
            $('#editTrans').show();
            $('#formEditTrans').trigger("reset");
            $('#formEditTrans input[name="oid"]').val(doc['_id']['$oid']);
            $('#formEditTrans input[name="message"]').val(doc['message']);
            $('#formEditTrans input[name="message"]').prop('disabled', 'disabled');
            for (k in doc['languages']) {
                $('#formEditTrans .languages[name="' + k + '"').val(doc['languages'][k]);
            }


        });

    });

    $('#btnCompileTrans').on('click', function() {
        $.ajax({
            url: "./updateTranslation/",
            method: 'POST'
        }).done(function(response) {
            toastr["success"](response['message']);
        });
    });


    $('#btnCreateTrans').on('click', function() {
        $('#resultTrans').hide();
        $('#editTrans').show();
        $('#formEditTrans').trigger("reset");
    });


    $('#btnsaveTrans').on('click', function() {
        data = { 'message': undefined, 'languages': {}, '_id': undefined }
        data['_id'] = $('#formEditTrans input[name="oid"]').val();
        data['message'] = $('#formEditTrans input[name="message"]').val();
        $.each($('#formEditTrans .languages'), function(i, el) {
            data['languages'][$(el)[0].name] = $(el).val();
        });
        console.log(data);
        $.ajax({
            url: "./editTranslation/",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function(response) {
            toastr["success"](response['message']);
            $('#formEditTrans').trigger("reset");
            $('#editTrans').hide();
            $('#resultTrans').hide();
        });

    })
});


function addFormElement() {
    $.get("/static/templates/formElement.html", function(data) {
        t = $.parseHTML(data)[0]
        t.content.querySelector('.name-input').setAttribute("name", "name-" + newElementId);
        t.content.querySelector('.type-input').setAttribute("name", "type-" + newElementId);
        t.content.querySelector('.order-input').setAttribute("name", "order-" + newElementId);
        t.content.querySelector('.order-input').setAttribute("value", newElementId);
        t.content.querySelector('.required-input').setAttribute("name", "required-" + newElementId);

        var clone = document.importNode(t.content, true);
        $('#formSourceType').append(clone);
        newElementId += 1;
    });
}

function addEditFormElement(element) {
    $.get("/static/templates/formElement.html", function(data) {
        t = $.parseHTML(data)[0]
        t.content.querySelector('.name-input').setAttribute("name", "name-" + element['order']);
        t.content.querySelector('.name-input').setAttribute("value", element['name']);
        t.content.querySelector('.type-input').setAttribute("name", "type-" + element['order']);
        //t.content.querySelector('.type-input').setAttribute("value", element['type']);
        t.content.querySelector('.order-input').setAttribute("name", "order-" + element['order']);
        t.content.querySelector('.order-input').setAttribute("value", element['order']);
        t.content.querySelector('.required-input').setAttribute("name", "required-" + element['order']);
        // t.content.querySelector('.required-input').setAttribute("value", element['required']);
        /* if (element['required'] == 'on') {
             t.content.querySelector('.required-input').setAttribute("checked", true);
         }*/
        if (element['required'] == 'on') {
            t.content.querySelector('.required-input').checked = true;
        }
        var clone = document.importNode(t.content, true);
        clone.querySelector('.type-input').value = element['type'];

        // $('#formElemSourceType').append(clone);
        $('#formSourceType').append(clone);
    });
}


function saveForm() {
    formData = $('#formSourceType').serializeArray();
    data = {}
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
            data[el['name']] = el['value'];
        }
    }

    if (curroid != "") {
        data['_id'] = curroid;
    }
    $.ajax({
            url: "./defineFormSource/",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function(response) {
            toastr["success"](response['message']);
            source = response['source'];
            $('#tableSources tbody').append('<tr><td>' + source['name'] + '</td><td><button type="button" class="btn btn-primary" data-oid="' + source['oid'] + '"><span class="oi oi-pencil"></span></button></td></tr>');
            curroid = "";
        })
        /*.fail(function(xhr, textStatus, errorThrown) {
             })*/
    ;
}