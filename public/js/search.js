const choices = import('./choices');

$(document).ready(function() {
  $("#submit").on("click", function() {
    event.preventDefault();

    const userCityDays = {
      city: $("#cityName")
        .val()
        .trim(),
      days: $("#days")
        .val()
        .trim()
    };
    
    const userCategories = {
      bar: $("#nightlife").is(":checked"),
      art: $("#museums").is(":checked"),
      restaurant: $("#food").is(":checked"),
      hotel: $("#hotels").is(":checked"),
      music: $("#music").is(":checked")
    };

    
    const userCategoriesArr = Object.entries(userCategories);
    const userCategoriesFinal = [];
   
    for (const [key, value] of userCategoriesArr) {
      if (value === true) {
        userCategoriesFinal.push(key);
      }
    }
    control(userCategoriesFinal, userCityDays);
    $.get("/itinerary").then(function(data){
      window.location.replace("/choices.html")
    })
  });

  async function control(userCategoriesFinal, userCityDays) {
    try {
      const categories = await apiCategoriesArrayMaker(userCategoriesFinal);
      const coordinates = await getCoordinates(userCityDays);
      const apiData = await apiCall(categories, coordinates);
      const itineraryOptions = await itineraryData(apiData, userCityDays);
      const itineraryObjArr = await getXidInfo(itineraryOptions);

      choices.display(itineraryObjArr);

    } catch (error) {
      return error;
    }
  }

  const apiCategoriesArrayMaker = userCategoriesFinal => {
    
    const hotels = {
      name: "hotel",
      kinds: "accomodations"
    };
    const museums = {
      name: "all",
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

    userCategoriesFinal.forEach(index => {
      for (const category of categories) {
        if (index === category.name) {
          apiCategories.push(category);
        }
      }
    });

    return apiCategories;
  };

  const getCoordinates = (userCityDays, apiCategoriesArrayMaker) => {
    let testURL = `https://api.opentripmap.com/0.1/en/places/geoname?name=${userCityDays.city}&country=us&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`;

    const coordinates = $.ajax({
      url: testURL,
      method: "GET"
    }).then(function(response) {
      let coordinates = {
        latitude: response.lat,
        longitude: response.lon
      };
      return coordinates;
    });
    return coordinates;
  };

  const apiCall = (categories, coordinates) => {
  
    const ajaxCalls = [];

    categories.forEach((data, index) => {
      const call = $.ajax({
        url: `https://api.opentripmap.com/0.1/en/places/autosuggest?name=${categories[index].name}&radius=10000&lon=${coordinates.longitude}&lat=${coordinates.latitude}&kinds=${categories[index].kinds}&rate=1&format=json&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`,
        method: "GET"
      });
      ajaxCalls.push(call);
    });
    const data = Promise.all(ajaxCalls).then((data, err) => {
     
      return data;
    });
    return data;
  };

  const itineraryData = (apiData, userCityDays) => {

    const xidArr = [];
  
    apiData.forEach(array => {
      for (var i = 0; i < userCityDays.days; i++) {
        xidArr.push(array[i].xid);
      }
    });
    return xidArr;
  };

  const getXidInfo = xidArr => {
    let xidInfoArr = [];

    xidArr.forEach(array => {
      console.log(array);

      $.ajax({
        url: `https://api.opentripmap.com/0.1/en/places/xid/${array}?apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`,
        method: "GET"
      }).then(response => {
        let xidDescripObj = {
          name: response.name,
          address: response.address.road,
          bio: response.wikipedia_extracts, //Tyler: this is an object that needs to be navitated to get the bio.  It will be bio.text to get the actualy bio blurb.
          image: response.preview, //image of location.  comes back as undefined if not provided.
          card: response.otm, // probably not usuable but its a card the api makes with wiki data if its included in the object
          url: response.url //url is usually a booking site included in the hotel bookings.
        };

        xidInfoArr.push(xidDescripObj);
      });
    });
    return xidInfoArr;
  };
});
