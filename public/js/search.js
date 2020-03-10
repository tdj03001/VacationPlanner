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
      nightlife: $("#nightlife").is(":checked"),
      museums: $("#museums").is(":checked"),
      food: $("#food").is(":checked"),
      hotels: $("#hotels").is(":checked"),
      music: $("#music").is(":checked")
    };

    // Creates an array of the key-value pairs from userCategories object
    const userCategoriesArr = Object.entries(userCategories);
    // Store user values 
    const userCategoriesFinal = [];
    // Loop through userCategoriesArr for true values and add to userCategoriesFinal
    for (const [key, value] of userCategoriesArr) {
      if (value === true) {
        userCategoriesFinal.push(key);
      }
    }

  });

  // Not entirely sure what these objects are doing 
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

  // Array of potential categories - looks like it never gets used? 
  const categories = [hotels, museums, food, music, nightlife];

  // Function to get location - not sure where location gets used - can it be deleted?
  const location = userCityDays => {
    let testURL = `https://api.opentripmap.com/0.1/en/places/geoname?name=${userCityDays.city}&country=us&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`;

    $.ajax({
      url: testURL,
      method: "GET"
    }).then(function(response) {

      let cityName = response.name;
      let latitude = response.lat;
      let longitude = response.lon;

      console.log(cityName, latitude, longitude);
    });
  };

  // This function looks like it's never used - can it be deleted?
  const callApi = (latitude, longitude, categories) => {
    const ajaxCalls = [];

    categories.forEach((data, index) => {
      const call = $.ajax({
        url: `https://api.opentripmap.com/0.1/en/places/autosuggest?name=${categories[index].name}&radius=3000&lon=${longitude}&lat=${latitude}&kinds=${categories[index].kinds}&rate=1&format=json&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`,
        method: "GET"
      });
      ajaxCalls.push(call);
    });
    console.log(ajaxCalls);

    Promise.all(ajaxCalls).then((data, err) => {
      itineraryOptions(data, vacaLength);
    });
  };
  
  // Test length of vacation
  const vacaLength = 3;

  const itineraryOptions = (data, vacaLength) => {
    const xidArr = [];
    data.forEach(array => {
      for (var i = 0; i < vacaLength; i++) {
        xidArr.push(array[i].xid);
      }
    });
    getXidInfo(xidArr);
  };

  const getXidInfo = xidArr => {
    let xidInfoArr = [];

    xidArr.forEach(array => {
      const call = $.ajax({
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
        console.log(xidInfoArr);
      });
    });
  };

  // location();
});
