$(document).ready(function() {
    buildingChart();

    elements1chart();

    elements2chart();

    sourceschart();

    $('#locationTable').on('click', '.btn-primary', function() {
        localStorage.setItem("oid", $(this).data('oid'));
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
            listLocations.push(gettext("Altri"));
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
                    display: false
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
            listLocations.push(gettext("Altri"));
            listLocationsData.push(count);
        }
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: listLocations,
                datasets: [{
                    label: gettext('Nr. Elementi'),
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#52b94d", "#cf3c1c", "#67e4e8", "#d0d33c"],
                    data: listLocationsData
                }]
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
            listLocations.push(gettext("Altri"));
            listLocationsData.push(count);
        }
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: listLocations,
                datasets: [{
                    label: gettext('Nr. Elementi'),
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
            listLocations.push(gettext("Altri"));
            listLocationsData.push(count);
        }
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: listLocations,
                datasets: [{
                    label: gettext("Nr. Fonti"),
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