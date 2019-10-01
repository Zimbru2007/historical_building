$(document).ready(function() {

    var ctx = $('#myChart');
    $.ajax({
        url: "./buildingStatistics/",
        method: 'GET'
    }).done(function(response) {
        toastr["success"](response['message']);
        docs = response['docs'];
        listLocations = [];
        listLocationsData = [];
        max = 5;
        count = 0;
        if (docs.length < max) {
            max = docs.length;
        }
        for (var i = 0; i < max; i++) {

            listLocations.push(docs[i]['name']);
            listLocationsData.push(docs[i]['count']);
        }
        for (var i = max; i < docs.length; i++) {
            count += docs[i]['count'];

        }
        listLocations.push("Altri");
        listLocationsData.push(count);

        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: listLocations,
                datasets: [{

                    backgroundColor: ["#3e95cd", "#8e5ea2", "#52b94d", "#cf3c1c", "#67e4e8", "#d0d33c"],
                    data: listLocationsData
                }]
            },
            options: {
                title: {
                    display: false,
                    text: 'Buildings in cities'
                }
            }
        });
    });
    $('#locationTable').on('click', '.btn-primary', function() {
        localStorage.setItem("oid", $(this).data('oid'));
        //$.cookie("oid", $(this).data('oid'));
        window.location.href = "/private/luoghi";

    });



});