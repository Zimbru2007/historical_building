$(document).ready(function() {
    buildingChart();

    elements1chart();

    elements2chart();

    sourceschart();

    $('#locationTable').on('click', '.btn-primary', function() {
        localStorage.setItem("oid", $(this).data('oid'));
        //$.cookie("oid", $(this).data('oid'));
        window.location.href = "/private/luoghi";

    });


});


function buildingChart() {
    var ctx = $('#buildingChart');
    $.ajax({
        url: "./mainStatistics/",
        method: 'GET',
        data: { 'buildings': 'buildings' }
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
        if (count != 0) {
            listLocations.push("Altri");
            listLocationsData.push(count);
        }

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
                    text: 'Buildings in locations'
                }
            }
        });
    });
}

function elements1chart() {
    var ctx = $('#elements1Chart');
    $.ajax({
        url: "./mainStatistics/",
        method: 'GET',
        data: { 'elements1': 'elements1' }
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
        if (count != 0) {
            listLocations.push("Altri");
            listLocationsData.push(count);
        }
        console.log(listLocationsData);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: listLocations,
                datasets: [{
                        label: 'Nr. Elements',
                        backgroundColor: ["#3e95cd", "#8e5ea2", "#52b94d", "#cf3c1c", "#67e4e8", "#d0d33c"],
                        data: listLocationsData
                    }]
                    /* datasets: [{
                         label: 'Nr. Elements',
                         backgroundColor: "#3e95cd",
                         borderColor: "#8e5ea2",
                         borderWidth: 1,
                         data: listLocationsData
                     }, {
                         label: 'Dataset 2',
                         backgroundColor: "#52b94d",
                         borderColor: "#cf3c1c",
                         borderWidth: 1,
                         data: listLocationsData
                     }]*/
            },
            options: {
                title: {
                    display: false,
                    text: 'Elements in locations'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 1
                        }
                    }]
                }
            }
        });
    });
}

function elements2chart() {
    var ctx = $('#elements2Chart');
    $.ajax({
        url: "./mainStatistics/",
        method: 'GET',
        data: { 'elements2': 'elements2' }
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

            listLocations.push(docs[i]['_id']);
            listLocationsData.push(docs[i]['count']);
        }
        for (var i = max; i < docs.length; i++) {
            count += docs[i]['count'];

        }
        if (count != 0) {
            listLocations.push("Altri");
            listLocationsData.push(count);
        }
        console.log(listLocationsData);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: listLocations,
                datasets: [{
                    label: 'Nr. Elements',
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#52b94d", "#cf3c1c", "#67e4e8", "#d0d33c"],
                    data: listLocationsData
                }]

            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 1
                        }
                    }]
                }
            }
        });
    });
}

function sourceschart() {
    var ctx = $('#sourcesChart');
    $.ajax({
        url: "./mainStatistics/",
        method: 'GET',
        data: { 'sources': 'sources' }
    }).done(function(response) {
        toastr["success"](response['message']);
        docs = response['docs'];
        console.log("docs111");
        console.log(docs);
        listLocations = [];
        listLocationsData = [];
        max = 5;
        count = 0;
        if (docs.length < max) {
            max = docs.length;
        }
        for (var i = 0; i < max; i++) {

            listLocations.push(docs[i]['_id']);
            listLocationsData.push(docs[i]['count']);
        }
        for (var i = max; i < docs.length; i++) {
            count += docs[i]['count'];

        }
        if (count != 0) {
            listLocations.push("Altri");
            listLocationsData.push(count);
        }
        console.log(listLocationsData);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: listLocations,
                datasets: [{
                    label: 'Nr. Sources',
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#52b94d", "#cf3c1c", "#67e4e8", "#d0d33c"],
                    data: listLocationsData
                }]

            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 1
                        }
                    }]
                }
            }
        });
    });
}