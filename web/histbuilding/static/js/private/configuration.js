newElementId = 1;
curroid = "";
var tableTransRes;

$(document).ready(function() {

    tableTransRes = $('#tableTransRes').DataTable();

    $('#sources-tab').on('click', function() {
        $('#newSourceType').show();
    });

    $('#elements-tab').on('click', function() {
        $('#newElementType').show();
    });

    $('#newSourceType').on('click', function() {
        $('#divSourceType').show();
        $('.formel').remove();
        $('input[name="name"]').val('');
        curroid = '';
        newElementId = 1;
        $(this).hide();
        $('#saveSrcForm').show();
        $('#cancelSrcForm').show();
        $('#updateSrcForm').hide();

    });

    $('#newElementType').on('click', function() {
        $('#divElementType').show();
        $('.formel').remove();
        $('input[name="elname"]').val('');
        curroid = '';
        newElementId = 1;
        $(this).hide();
        $('#saveElForm').show();
        $('#cancelElForm').show();
        $('#updateElForm').hide();

    });

    $('#tableSources').on('click', '.btn-primary', function() {
        oid = $(this).data('oid');
        curroid = oid;
        $.ajax({
                url: "./defineFormSource/",
                method: 'GET',
                data: { 'oid': oid }

            }).done(function(response) {
                source = response['source'];
                maxElementId = 1;
                $('#divSourceType').show();
                $('.formel').remove();

                $('#newSourceType').hide();
                $('#updateSrcForm').show();
                $('#cancelSrcForm').show();
                $('#saveSrcForm').hide();
                $('input[name="name"]').val(source['name']);
                for (var i = 0; i < source['elements'].length; i++) {
                    addSrcEditFormElement(source['elements'][i]);
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

    $('#tableElements').on('click', '.btn-primary', function() {
        console.log('edit elemento descrittivo');
        oid = $(this).data('oid');
        curroid = oid;
        $.ajax({
            url: "./defineFormElement/",
            method: 'GET',
            data: { 'oid': oid }

        }).done(function(response) {
            element = response['element'];
            maxElementId = 1;
            $('#divElementType').show();
            $('.formel').remove();

            $('#newElementType').hide();
            $('#updateElForm').show();
            $('#cancelElForm').show();
            $('#saveElForm').hide();
            $('input[name="elname"]').val(element['name']);
            for (var i = 0; i < element['elements'].length; i++) {
                addElEditFormElement(element['elements'][i]);
                tempElemntId = parseInt(element['elements'][i]['order']);
                if (maxElementId <= tempElemntId) {
                    maxElementId = tempElemntId + 1;
                }
            }
            newElementId = maxElementId;
        });

    });
    $('#addSrcForm').on('click', function() {
        addSrcFormElement()
    });

    $('#addElForm').on('click', function() {
        addElFormElement()
    });

    $('#saveSrcForm').on('click', function() {
        saveSrcForm();

    });

    $('#saveElForm').on('click', function() {
        saveElForm();

    });

    $('#updateSrcForm').on('click', function() {
        saveSrcForm();

    });

    $('#updateElForm').on('click', function() {
        saveElForm();

    });

    $('#cancelSrcForm').on('click', function() {
        r = confirm("Vuoi davvero cancellare tutte le modifiche?");
        if (r == true) {
            hideSrc();
        }


    });

    $('#cancelElForm').on('click', function() {
        r = confirm("Vuoi davvero cancellare tutte le modifiche?");
        if (r == true) {
            hideEl();
        }

    });

    $('#btnSearchTrans').on('click', function() {
        $.ajax({
            url: "./editTranslation/",
            method: 'GET',
            data: { 'query': $('input[name="search_string"]').val() }
        }).done(function(response) {
            $('#tableTransRes').hide();
            $('#alertNoresult').hide();
            $('#editTrans').hide();
            tableTransRes.destroy();
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
            tableTransRes = $('#tableTransRes').DataTable();
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
        }).fail(function(xhr, textStatus, errorThrown) {
            toastr["error"]("Error: " + xhr.responseJSON.message);
        });

    })
});


function addSrcFormElement() {
    $.get("/static/templates/formElement.html", function(data) {
        t = $.parseHTML(data)[0]
        t.content.querySelector('.formel').setAttribute("id", "formel-" + newElementId);
        t.content.querySelector('.xbutton-input').setAttribute("name", "xbutton-" + newElementId);
        t.content.querySelector('.xbutton-input').setAttribute("id", "xbutton-" + newElementId);
        t.content.querySelector('.xbutton-input').setAttribute("data-oid", newElementId);
        t.content.querySelector('.name-input').setAttribute("name", "name-" + newElementId);
        t.content.querySelector('.type-input').setAttribute("name", "type-" + newElementId);
        t.content.querySelector('.order-input').setAttribute("name", "order-" + newElementId);
        t.content.querySelector('.order-input').setAttribute("value", newElementId);
        t.content.querySelector('.required-input').setAttribute("name", "required-" + newElementId);
        var clone = document.importNode(t.content, true);
        $('#formSourceType').append(clone);
        $('#xbutton-' + newElementId).on('click', function() {
            oid = $(this).data('oid');
            $('#formel-' + oid).remove();

        });
        newElementId += 1;
    });
}

function addElFormElement() {
    $.get("/static/templates/formElement.html", function(data) {
        t = $.parseHTML(data)[0];
        t.content.querySelector('.formel').setAttribute("name", "formel-" + newElementId);
        t.content.querySelector('.xbutton-input').setAttribute("name", "xbutton-" + newElementId);
        t.content.querySelector('.name-input').setAttribute("name", "name-" + newElementId);
        t.content.querySelector('.type-input').setAttribute("name", "type-" + newElementId);
        t.content.querySelector('.order-input').setAttribute("name", "order-" + newElementId);
        t.content.querySelector('.order-input').setAttribute("value", newElementId);
        t.content.querySelector('.required-input').setAttribute("name", "required-" + newElementId);

        var clone = document.importNode(t.content, true);
        $('#formElementType').append(clone);
        newElementId += 1;
    });
}

function addSrcEditFormElement(element) {
    $.get("/static/templates/formElement.html", function(data) {
        t = $.parseHTML(data)[0]
        t.content.querySelector('.formel').setAttribute("name", "formel-" + element['order']);
        t.content.querySelector('.xbutton-input').setAttribute("name", "xbutton-" + element['order']);
        t.content.querySelector('.name-input').setAttribute("name", "name-" + element['order']);
        t.content.querySelector('.name-input').setAttribute("value", element['name']);
        t.content.querySelector('.type-input').setAttribute("name", "type-" + element['order']);
        t.content.querySelector('.order-input').setAttribute("name", "order-" + element['order']);
        t.content.querySelector('.order-input').setAttribute("value", element['order']);
        t.content.querySelector('.required-input').setAttribute("name", "required-" + element['order']);

        if (element['required'] == 'on') {
            t.content.querySelector('.required-input').checked = true;
        }
        var clone = document.importNode(t.content, true);
        clone.querySelector('.type-input').value = element['type'];

        $('#formSourceType').append(clone);
    });
}

function addElEditFormElement(element) {
    $.get("/static/templates/formElement.html", function(data) {
        t = $.parseHTML(data)[0]
        t.content.querySelector('.formel').setAttribute("name", "formel-" + element['order']);
        t.content.querySelector('.xbutton-input').setAttribute("name", "xbutton-" + element['order']);
        t.content.querySelector('.name-input').setAttribute("name", "name-" + element['order']);
        t.content.querySelector('.name-input').setAttribute("value", element['name']);
        t.content.querySelector('.type-input').setAttribute("name", "type-" + element['order']);
        t.content.querySelector('.order-input').setAttribute("name", "order-" + element['order']);
        t.content.querySelector('.order-input').setAttribute("value", element['order']);
        t.content.querySelector('.required-input').setAttribute("name", "required-" + element['order']);

        if (element['required'] == 'on') {
            t.content.querySelector('.required-input').checked = true;
        }
        var clone = document.importNode(t.content, true);
        clone.querySelector('.type-input').value = element['type'];


        $('#formElementType').append(clone);
    });
}


function saveSrcForm() {
    formData = $('#formSourceType').serializeArray();

    has_required = false;
    data = {};
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
            if (feature == "required" && el['value'] == "on") {
                has_required = true;
            }
        } else {
            data[el['name']] = el['value'];
        }
    }
    if (curroid != "") {
        data['_id'] = curroid;
    }

    if (has_required) {
        saveSrcData(data);

    } else {
        r = confirm(gettext("Non hai campi obbligatori") + ". " + gettext("Vuoi impostare il campo") + " '" + data['el-1']['name'] + "' " + gettext("con l'opzione 'obbligatorio'") + "?");
        if (r == true) {
            data['el-1']['required'] = "on";
            saveSrcData(data);
        } else {

        }
    }

}

function saveSrcData(data) {
    hideSrc();
    $.ajax({
        url: "./defineFormSource/",
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        toastr["success"](response['message']);
        source = response['source'];
        curroid = "";
        updateTable('#tableSources');
    });
}

function saveElForm() {
    formData = $('#formElementType').serializeArray();
    has_required = false;
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
            if (feature == "required" && el['value'] == "on") {
                has_required = true;
            }
        } else {
            data[el['name']] = el['value'];
        }
    }

    if (curroid != "") {
        data['_id'] = curroid;
    }
    if (has_required) {
        saveElData(data);
    } else {
        r = confirm(gettext("Non hai campi obbligatori") + ". " + gettext("Vuoi impostare il campo") + " '" + data['el-1']['name'] + "' " + gettext("con l'opzione 'obbligatorio'") + "?");
        if (r == true) {
            data['el-1']['required'] = "on";
            saveElData(data);
        } else {

        }
    }

}

function saveElData(data) {
    hideEl();
    $.ajax({
        url: "./defineFormElement/",
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        toastr["success"](response['message']);
        element = response['element'];
        curroid = "";
        updateTable('#tableElements');

    });
}

function updateTable(tableName) {
    $(tableName).load(window.location.href + " " + tableName);
}

function hideSrc() {
    $('#divSourceType').hide();
    $('#saveSrcForm').hide();
    $('#cancelSrcForm').hide();
    $('#updateSrcForm').hide();
    $('#newSourceType').show();
}

function hideEl() {
    $('#divElementType').hide();
    $('#updateElForm').hide();
    $('#cancelElForm').hide();
    $('#saveElForm').hide();
    $('#newElementType').show();
}