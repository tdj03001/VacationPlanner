$(document).ready(function() {
  $("#submit").on("click", function() {
    event.preventDefault();

    // Takes values from user city and days from input, creates object
    const userCityDays = {
      city: $("#cityName")
        .val()
        .trim(),
      days: $("#days")
        .val()
        .trim()
    };
    // Takes values from user categories, creates object
    const userCategories = {
      bar: $("#nightlife").is(':checked'),

      // .trim(),
      art: $("#museums").is(':checked'),
      // .trim(),
      restaurant: $("#food").is(':checked'),
      // .trim(),
      hotel: $("#hotels").is(':checked'),
      // .trim(),
      music: $("#music").is(':checked')

    }

    //Puts only true category responses into an userCategories final Array
    const userCategoriesArr = Object.entries(userCategories);
    // Store user values 
    const userCategoriesFinal = [];
    // Loop through userCategoriesArr for true values and add to userCategoriesFinal
    for (const [key, value] of userCategoriesArr) {
      if (value === true) {
        userCategoriesFinal.push(key);
      }
    }

    console.log("1111111")

g


    console.log(userCategoriesFinal, userCityDays);
    // location(userCityDays, apiCategoriesArrayMaker);
    control(userCategoriesFinal, userCityDays);
  });


  async function control(userCategoriesFinal, userCityDays) {
    console.log("3333333333")
    try {
      const categories = await apiCategoriesArrayMaker(userCategoriesFinal);
      const coordinates = await getCoordinates(userCityDays);
      const apiData = await apiCall(categories, coordinates);
      const itineraryOptions = await itineraryData(apiData, userCityDays);
      const itineraryObjArr = await getXidInfo(itineraryOptions);


      console.log("xidInfoArr");
      console.log(itineraryObjArr);


    } catch (error) {
      console.log(error);
    }

  }


  const apiCategoriesArrayMaker = (userCategoriesFinal) => {
    console.log("33333333333");
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
    const apiCategories = [];

    // console.log(userCategoriesFinal, nightlife);
    // console.log(categories);
    userCategoriesFinal.forEach(index => {
      for (const category of categories) {
        // console.log(index);
        if (index === category.name) {
          apiCategories.push(category);
        }

      }
    })

    return apiCategories;
  }

  const getCoordinates = (userCityDays, apiCategoriesArrayMaker) => {


    let testURL = `https://api.opentripmap.com/0.1/en/places/geoname?name=${userCityDays.city}&country=us&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`;

    const coordinates = $.ajax({
      url: testURL,
      method: "GET"
    }).then(function(response) {

      // console.log("location call");
      //console.log(response);
      // let cityName = response.name;
      // let latitude = response.lat;
      // let longitude = response.lon;

      let coordinates = {
        latitude: response.lat,
        longitude: response.lon
      };
      return (coordinates);

      console.log(cityName, latitude, longitude, apiCategoriesArrayMaker);;
      console.log(coordinates)

      // callApi(latitude, longitude, apiCategoriesArrayMaker);

    });
    return coordinates;
  };

  const apiCall = (categories, coordinates) => {
    console.log(categories);
    const ajaxCalls = [];

    categories.forEach((data, index) => {
      const call = $.ajax({


        url: `https://api.opentripmap.com/0.1/en/places/autosuggest?name=${categories[index].name}&radius=10000&lon=${coordinates.longitude}&lat=${coordinates.latitude}&kinds=${categories[index].kinds}&rate=1&format=json&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`,
        method: "GET"
      });
      ajaxCalls.push(call);


    })
    // console.log(ajaxCalls);
    const data = Promise.all(ajaxCalls).then((data, err) => {
      console.log("promise data")

      // itineraryOptions(data, vacaLength);
      return data;

    });
    return data;
  };

  // const vacaLength = 3;

  const itineraryData = (apiData, userCityDays) => {
    console.log("navigate data");
    console.log(apiData, userCityDays.days);
    const xidArr = [];
    //forEach data index, I want xid from first three
    apiData.forEach(array => {
      for (var i = 0; i < userCityDays.days; i++) {
        console.log("inside for loop");
        xidArr.push(array[i].xid);
      }
    });
    return(xidArr);
  };

  const getXidInfo = xidArr => {
    let xidInfoArr = [];

    xidArr.forEach(array => {


      console.log(array);

      $.ajax({
        url: `https://api.opentripmap.com/0.1/en/places/xid/${array}?apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`,
        method: "GET"
      }).then(response => {
        // console.log("response")
        // console.log(response);

        let xidDescripObj = {
          name: response.name,
          address: response.address.road,
          bio: response.wikipedia_extracts, //Tyler: this is an object that needs to be navitated to get the bio.  It will be bio.text to get the actualy bio blurb.
          image: response.preview, //image of location.  comes back as undefined if not provided.
          card: response.otm, // probably not usuable but its a card the api makes with wiki data if its included in the object
          url: response.url //url is usually a booking site included in the hotel bookings.
        };

        xidInfoArr.push(xidDescripObj);
        // console.log(xidInfoArr)
      })
    })
    return(xidInfoArr);
  }
  // location();
});
