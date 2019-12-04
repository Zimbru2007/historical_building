var elementstable;

$(document).ready(function() {
    elementstable = $('#elementsTable').DataTable();
    elementstable.destroy();
    updateElementsEntities();

    $('#elementsTable').on('click', '.btn-primary', function() {
        console.log('edit');
        oid = $(this).data('oid');
        location.replace('/private/elementi/?elementid=' + oid);

    })
})

function updateElementsEntities() {
    $.ajax({
        url: "./manageListElements/",
        method: 'GET',
        data: {},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        console.log(response);
        elements = response['elements'];
        //doc = response['doc'];

        /*$('#sourcesTable').DataTable({
            "ajax": docs
        });*/

        /*has_required = false;
        $('#sourcesTable thead tr').empty();
        for (var key in doc) {
            $('#sourcesTable thead tr').append("<th>" + key + "</th>")
            has_required = true;
        }
        if (!has_required) {
            $('#sourcesTable thead tr').append("<th>id</th>")
        }
        $('#sourcesTable thead tr').append("<th>Modifica</th>")*/

        $('#elementsTable tbody').empty();
        for (var i = 0; i < elements.length; i++) {
            $('#elementsTable tbody').append("<tr id='elementsTable" + i + "'> </tr> ");
            var fontenames = '';
            for (var j = 0; j < elements[i]['fontename'].length; j++) {
                for (var key in elements[i]['fontename'][j]) {
                    if (key != '_id') {
                        fontenames += elements[i]['fontename'][j][key];
                        fontenames += ' ';
                    }
                }
                fontenames += ';';
            }
            var elementname = '';
            $('#elementsTable' + i).append("<td>" + fontenames + "</td>");
            $('#elementsTable' + i).append("<td>" + elements[i]['locationname'] + "</td>");
            $('#elementsTable' + i).append("<td>" + elements[i]['buildingname'] + "</td>");
            $('#elementsTable' + i).append("<td>" + elements[i]['elementname'] + "</td>");

            for (var key in elements[i]['element']) {
                if (key != 'element_id' && key != 'elementname') {
                    elementname += elements[i]['element'][key];
                    elementname += ' ';
                }
            }
            $('#elementsTable' + i).append("<td>" + elementname + "</td>");

            $('#elementsTable' + i).append("<td><button type='button' class='btn btn-primary' data-oid='" + elements[i]['_id']['$oid'] + "'><span class='oi oi-pencil'></span></button></td>");

        }
        elementstable = $('#elementsTable').DataTable();
    });
}