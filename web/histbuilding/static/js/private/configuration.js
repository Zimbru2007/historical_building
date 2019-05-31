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