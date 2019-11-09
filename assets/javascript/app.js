$(document).ready(function () {
    const firebaseConfig = {
        apiKey: "AIzaSyDqR4P-JwBJRcwL9aJEcPMmu5pdRicIYuk",
        authDomain: "trainschedule-535dc.firebaseapp.com",
        databaseURL: "https://trainschedule-535dc.firebaseio.com",
        projectId: "trainschedule-535dc",
        storageBucket: "trainschedule-535dc.appspot.com",
        messagingSenderId: "1007375178585",
        appId: "1:1007375178585:web:0b87f4441a39cdabaf0a48"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);


    const db = firebase.database();

    var trainname, destination;
    var traintime = 00;
    var frequency = 0;

    $('#addTrain').on('click', function (e) {
        e.preventDefault();

        trainname = $('#TrainName').val().trim();
        destination = $('#Dest').val().trim();
        traintime = $('#TrainTime').val().trim();
        frequency = $('#Frequency').val().trim();

        var newtraindata = {
            name: trainname,
            destination: destination,
            traintime: traintime,
            frequency: frequency,
        }

        db.ref().push(newtraindata);

        console.log(newtraindata.name, newtraindata.destination, newtraindata.traintime, newtraindata.frequency);
        $('#TrainName').val("");
        $('#Dest').val("");
        $('#TrainTime').val("");
        $('#Frequency').val("");
    })



    db.ref().on("child_added", function (childSnapshot) {
        trainname = childSnapshot.val().name;
        destination = childSnapshot.val().destination;
        traintime = childSnapshot.val().traintime;
        frequency = childSnapshot.val().frequency;

        var nextarrival, frequencytrain;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var timeConverted = moment(traintime, "hh:mm").subtract(1, "years");
        console.log(timeConverted);

        var timeDifference = moment().diff(moment(timeConverted), "m");
        var trainReminder = timeDifference % frequency;

        // minutes since last train
        frequencytrain = frequency - trainReminder;

        nextarrival = moment().add(frequencytrain, "m").format("hh:mm A");

        // append data to table 
        var newRow = $("<tr>");
        newRow.append("<td>" + trainname + "</td>");
        newRow.append("<td>" + destination + "</td>");
        newRow.append("<td>" + frequency + "</td>");
        newRow.append("<td>" + nextarrival + "</td>");
        newRow.append("<td>" + frequencytrain + "</td>");

        $('#trainschedule').append(newRow);


        // Handles any database errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });






})