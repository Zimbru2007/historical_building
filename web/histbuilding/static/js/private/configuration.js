newElementId = 1;

$(document).ready(function() {

    $('#newSourceType').on('click', function(){
        $('#divSourceType').show();
        $('.formel').remove();
        newElementId = 1;
        $(this).hide();
        $('#saveForm').show();

    });

    $('#addElForm').on('click', function (){
        addFormElement()
    });

    $('#saveForm').on('click', function(){
        saveForm();
        $('#divSourceType').hide();
        $(this).hide();
        $('#newSourceType').show();
    });

    $('#btnSearchTrans').on('click', function(){
        $.ajax({
            url: "./editTranslation/",
            method: 'GET',
            data: {'query': $('input[name="search_string"]').val()}
        }).done(function(response) { 
            $('#tableTransRes').hide();
            $('#alertNoresult').hide();
            $('#tableTransRes tbody').empty();
            $('#resultTrans').show();
            docs = response['docs']
            if (docs.length == 0){
                $('#alertNoresult').show();
            }
            else{
                
                for (var i=0; i<docs.length; i++){
                    $('#tableTransRes tbody').append("<tr><td>" + docs[i]['message'] + "</td><td><button data-oid='" + docs[i]['_id']['$oid'] + "' class='btn btn-primary'><span class='oi oi-pencil'></span></button></td> ");
                }
                $('#tableTransRes').show();
            }
            
        });

    });


    $('#tableTransRes').on('click','.btn-primary',function(){
        oid = $(this).data('oid')
        $.ajax({
            url: "./editTranslation/",
            method: 'GET',
            data: {'oid': oid}
        }).done(function(response) { 
            doc= response['doc'];
            $('#resultTrans').hide();
            $('#editTrans').show();
            $('#formEditTrans').trigger("reset");
            $('#formEditTrans input[name="oid"]').val(doc['_id']['$oid']);
            $('#formEditTrans input[name="message"]').val(doc['message']);
            $('#formEditTrans input[name="message"]').prop('disabled', 'disabled');
            for (k in doc['languages']){
                $('#formEditTrans .languages[name="' + k + '"' ).val(doc['languages'][k]);
            }

            
        });

    });

    $('#btnCompileTrans').on('click', function(){
        $.ajax({
            url: "./updateTranslation/",
            method: 'POST'
        }).done(function(response) { 
            toastr["success"](response['message']);
        });
    });


    $('#btnCreateTrans').on('click', function(){
        $('#resultTrans').hide();
        $('#editTrans').show();
        $('#formEditTrans').trigger("reset");
    });


    $('#btnsaveTrans').on('click', function(){
        data={'message': undefined, 'languages':{}, '_id':undefined}
        data['_id'] = $('#formEditTrans input[name="oid"]').val();
        data['message'] = $('#formEditTrans input[name="message"]').val();
        $.each($('#formEditTrans .languages'), function(i, el){
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


function addFormElement(){
    $.get("/static/templates/formElement.html", function( data ) {
        t = $.parseHTML(data)[0]
        t.content.querySelector('.name-input').setAttribute("name","name-"+ newElementId);
        t.content.querySelector('.label-input').setAttribute("name","label-"+ newElementId);
        t.content.querySelector('.type-input').setAttribute("name","type-"+ newElementId);
        t.content.querySelector('.order-input').setAttribute("name","order-"+ newElementId);
        t.content.querySelector('.order-input').setAttribute("value",newElementId);
        t.content.querySelector('.required-input').setAttribute("name","required-"+newElementId);
        
        var clone = document.importNode(t.content, true);
        $('#formSourceType').append(clone);
        newElementId += 1;
    });
}


function saveForm(){
    formData = $('#formSourceType').serializeArray();
    data = {}
    for (var i=0; i<formData.length; i++){
        el = formData[i];
        if (el['name'].indexOf('-') != -1){
            idEl = el['name'].split("-")[1];
            feature = el['name'].split("-")[0]
            keyEl = 'el-'+ idEl;
            if (keyEl in data == false){
                data[keyEl] = {}
            }
            data[keyEl][feature] = el['value'];
        }
        else{
            data[el['name']] = el['value'];
        }
    }
    $.ajax({
        url: "./defineFormSource/",
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) { 
        toastr["success"](response['message']);
    });
}