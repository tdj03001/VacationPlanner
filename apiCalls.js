$(document).ready(function () {

    //     DROP DATABASE IF EXISTS vacation_db;
    // CREATE DATABASE vacation_db;
    // USE vacation_db;
    // CREATE TABLE users (
    // 	id INT NOT NULL AUTO_INCREMENT,
    //     first_name VARCHAR(20) NOT NULL,
    //     last_name VARCHAR(20) NOT NULL,
    //     email VARCHAR(60) NOT NULL,
    //     password VARCHAR(20) NOT NULL,
    //     PRIMARY KEY (id)
    // );
    // CREATE TABLE itinerary(
    // 	id INT NOT NULL AUTO_INCREMENT,
    //     userid INT NOT NULL,
    //     city VARCHAR(30) NOT NULL,
    //     xid VARCHAR(30) NOT NULL,
    //     dayof INT not null,
    //     PRIMARY KEY (id)
    // );

    const location = () => {

        var testURL = "https://api.opentripmap.com/0.1/en/places/geoname?name=philadelphia&country=us&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d";

        $.ajax({
            url: testURL,
            method: "GET"

        }).then(function (response) {

            console.log("location call");
            console.log(response);
            let cityName = response.name;
            let latitude = response.lat;
            let longitude = response.lon;

        });
    };

    // Outdoors
    // Nightlife
    // Cultuer’museums
    // Food and beverage
    // Hotels in area

    //promise.All

    // const nameArr = {
    //     nightlife: {
    //         name: "bars",
    //         kind: "karoke"
    //     },
    //     outdoors: {
    //         name: "natural",
    //         kind: "water"
    //     }
    // }
    // const { nightlife: { name } } = nameArr;
    // console.log(name) //bars

    const promiseArray = [];
    const categories = ["nightlife", "outdoors"];
    const callApi = (name, kind) => {
        $.ajax({
            method: "GET",
            url: "<Some api>"
        }).catch(error => (console.log(error)))
    }
    categories.forEach(category => {
        promiseArray.push(callApi(category))
    });
    Promise.all(promiseArray).then(
        values => (console.log(values)) //Array of data from ajax calls
    );

    // const nameArr = {
    //     outdoors: {
    //         name: hiking
    //     kind: 
    // }
    }

    // var testURL = `https://api.opentripmap.com/0.1/en/places/autosuggest?name=${nameArr.outdoors.name}radius=3000&lon=-75.1652&lat=39.9526&kinds=museums&rate=1&format=json&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`;

    // const kindsArr = [museums,]

    // const artMuseums = () => {

    //     var testURL = "https://api.opentripmap.com/0.1/en/places/autosuggest?name=art&radius=3000&lon=-75.1652&lat=39.9526&kinds=museums&rate=1&format=json&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d";

    //     $.ajax({
    //         url: testURL,
    //         method: "GET"

    //     }).then(function (response) {

    //         console.log("art museum call");
    //         console.log(response);
    //         console.log(response[0].name);


    //     });
    // };

    // artMuseums();
    
    location();
});

