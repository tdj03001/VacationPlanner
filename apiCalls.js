
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


    const hotels = {
        name: "hotel",
        kinds: "accomodations"
    };
    const museums = {
        name: "art",
        kinds: "museums"
    };

    const food = {
        name: "restaurant",
        kinds: "foods"
    };

    const music = {
        name: "music",
        kinds: "theatres_and_entertainments"
    };

    const nightlife = {
        name: "bar",
        kinds: "foods"
    };

    const categories = [hotels, museums, food, music, nightlife];

    const location = () => {

        let testURL = "https://api.opentripmap.com/0.1/en/places/geoname?name=philadelphia&country=us&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d";

        $.ajax({
            url: testURL,
            method: "GET"

        }).then(function (response) {

            // console.log("location call");
            //console.log(response);
            let cityName = response.name;
            let latitude = response.lat;
            let longitude = response.lon;

            console.log(latitude, longitude);



            //console.log(categories.hotelsl.name);

            callApi(latitude, longitude, categories);

        });
    };




    // const { nightlife: { name } } = nameArr;
    // console.log(name) //bars


    const callApi = (latitude, longitude, categories) => {
        const ajaxCalls = [];

        categories.forEach((data, index) => {

            const call = $.ajax({

                url: `https://api.opentripmap.com/0.1/en/places/autosuggest?name=${categories[index].name}&radius=3000&lon=${longitude}&lat=${latitude}&kinds=${categories[index].kinds}&rate=1&format=json&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`,
                method: "GET"

            });
            ajaxCalls.push(call);

        })
        console.log(ajaxCalls);
        Promise.all(ajaxCalls).then((data, err) => {
            // console.log("promise data")

            itineraryOptions(data, vacaLength);
        });
    };
    const vacaLength = 3;

    const itineraryOptions = ((data, vacaLength) => {
        // console.log("navigate data");
        // console.log(data);
        const xidArr = [];
        //forEach data index, I want xid from first three
        data.forEach(array => {
            for (var i = 0; i < vacaLength; i++){
                console.log("inside for loop");
            xidArr.push(array[i].xid);
            }
        });
        console.log(xidArr);
    });

    // const vacaLength = 3;

    // const itineraryOptions = (data, vacaLength) => {
    //     // console.log("navigate data");
    //     const xidArr = [];
    //     //forEach data index, I want xid from first three
    //     data.forEach((array) => {
    //         for (var i = 0; i < vacaLength; i++) {
    //             xidArr.push(array[i].xid)
    //         }
    //     });
    //     console.log(xidArr);
    // };







    // console.log(promiseData);

    //1. categories selected should be passed as an array
    //2. number of days passed as variable
    //


    location();
});

