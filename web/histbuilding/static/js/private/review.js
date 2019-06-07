$(document).ready(function() {

    $('input[name="building"]').typeahead({
        onSelect: function(item) {
            console.log(item);
            $('#insertReview').show();
            $('input[name="building"]').prop('disabled', 'disabled');
            $('#changeBuilding').show();
            getReview(item['value']);
        },
        ajax: {
            url: '/private/palazzi/manageBuilding/',
            displayField: "name",
            triggerLength: 1,
            preProcess: function (data) {
                listLocations = [];
                console.log(data);
                for (var i =0; i<data['docs'].length; i++){
                    listLocations.push({'id': data['docs'][i]['_id']['$oid'], 'name': data['docs'][i]['name']});
                }
                return listLocations;
            }
        }
    });


    $('#changeBuilding').on('click', function(){
        $('input[name="building"]').prop('disabled', '');
        $('input[name="building"]').val(undefined);
        $('#insertReview').hide();
        $(this).hide();
    });

    $('#submitReview').on('click', function(){
        formData = {'oid': $('input[name="oid"]').val(), 'review': tinymce.get('review').getContent()}
        
        $.ajax({
            url: "/private/palazzi/manageBuilding/",
            method: 'POST',
            data: JSON.stringify(formData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function(response) { 
            toastr["success"](response['message']);
        });
    })


    tinymce.init({
        selector: '#review',
        //plugins : 'advlist autolink link image lists charmap print preview',
        skin: 'oxide-dark',
        height: 600,
        plugins: [
        'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
        'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
        'save table contextmenu directionality emoticons template paste textcolor'
        ],
        image_prepend_url: '/static/img/buildings/',
        images_upload_handler: imagesUploadHandler,
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons'
      });
});



function imagesUploadHandler(blobInfo, success, failure) {
    console.log('imagesUploadHandler')
    let formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    $.ajax({
        url: "/private/uploadImage/",
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
    }).done(function(response) { 
        console.log(response);
        success(response.filename);
    }).fail(function(response){
        failure('Something went wrong');
    })
}


function getReview(oid){
    $.ajax({
        url: "/private/palazzi/manageBuilding/",
        method: 'GET',
        data: {'oid': oid},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function(response) {
        doc = response['doc'];
        $('input[name="oid"]').val(doc['_id']['$oid']);
        if ('review' in doc){
            tinymce.get('review').setContent(doc['review']);
        }
        console.log(response);
    });
}