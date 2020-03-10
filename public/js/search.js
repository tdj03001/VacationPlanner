$(document).ready(function () {
  $("#submit").on("click", function () {
    event.preventDefault();

    const userCityDays = {
      city: $("#cityName").val().trim(),
      days: $("#days").val().trim()

    }

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
    const userCategoriesFinal = [];

    for (const [key, value] of userCategoriesArr) {
      if (value === true) {
        userCategoriesFinal.push(key);
      }
    }

    console.log("1111111")


    // console.log(userCategoriesFinal);
    // apiCategoriesArrayMaker(userCategoriesFinal)
    // location(userCityDays, apiCategoriesArrayMaker);
    control();
  });

    
  async function control () {
    console.log("222222222")
    try {
      
    } catch (error) {
      console.log(err);
    }
    
  }

  const apiCategoriesArrayMaker = (userCategoriesFinal) => {
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
        if (index === category.name){
          apiCategories.push(category);
        }
        
      }
    })

    return apiCategories;
  }

  const location = (userCityDays, apiCategoriesArrayMaker) => {

    let testURL = `https://api.opentripmap.com/0.1/en/places/geoname?name=${userCityDays.city}&country=us&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`;

    $.ajax({
      url: testURL,
      method: "GET"

    }).then(function (response) {

      // console.log("location call");
      //console.log(response);
      let cityName = response.name;
      let latitude = response.lat;
      let longitude = response.lon;

      console.log(cityName, latitude, longitude, apiCategoriesArrayMaker);;

      // callApi(latitude, longitude, apiCategoriesArrayMaker);

    });
  };

  const callApi = (latitude, longitude, apiCategoriesArrayMaker) => {
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
      for (var i = 0; i < vacaLength; i++) {
        console.log("inside for loop");
        xidArr.push(array[i].xid);
      }
    });
    getXidInfo(xidArr);
  });

  const getXidInfo = (xidArr) => {

    let xidInfoArr = [];

    xidArr.forEach(array => {

      // console.log(array);

      const call = $.ajax({
        url: `https://api.opentripmap.com/0.1/en/places/xid/${array}?apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`,
        method: "GET"
      }).then(response => {
        console.log("response")
        console.log(response);

        let xidDescripObj = {
          name: response.name,
          address: response.address.road,
          bio: response.wikipedia_extracts, //Tyler: this is an object that needs to be navitated to get the bio.  It will be bio.text to get the actualy bio blurb.
          image: response.preview, //image of location.  comes back as undefined if not provided.
          card: response.otm, // probably not usuable but its a card the api makes with wiki data if its included in the object
          url: response.url //url is usually a booking site included in the hotel bookings.

        };

        xidInfoArr.push(xidDescripObj);
        console.log(xidInfoArr)
      })
    })
  }

  // location();

});