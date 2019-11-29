var elementstable;

$(document).ready(function() {
    elementstable = $('#elementsTable').DataTable();

    updateElementsEntities(val);
})

function updateElementsEntities(oid) {
    $.ajax({
        url: "./manageListElements/",
        method: 'GET',
        data: {},
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