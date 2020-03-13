$(document).ready(function() {
  let userCityDays;
  let userCategories;
  let userCategoriesArr;
  let userCategoriesFinal;

  $("#submit").on("click", function() {
    $(".box").hide();
    $("#cards").show();
    event.preventDefault();

    userCityDays = {
      city: $("#cityName")
        .val()
        .trim(),
      days: $("#days")
        .val()
        .trim()
    };

    userCategories = {
      bar: $("#nightlife").is(":checked"),
      art: $("#museums").is(":checked"),
      restaurant: $("#food").is(":checked"),
      hotel: $("#hotels").is(":checked"),
      music: $("#music").is(":checked")
    };

    userCategoriesArr = Object.entries(userCategories);
    userCategoriesFinal = [];

    for (const [key, value] of userCategoriesArr) {
      if (value === true) {
        userCategoriesFinal.push(key);
      }
    }
    control(userCategoriesFinal, userCityDays);
  });
  return userCategoriesFinal, userCityDays;
});

async function control(userCategoriesFinal, userCityDays) {
  try {
    debugger;
    const categories = await apiCategoriesArrayMaker(userCategoriesFinal);
    const coordinates = await getCoordinates(userCityDays);
    const apiData = await apiCall(categories, coordinates);
    const itineraryOptions = await itineraryData(apiData, userCityDays);
    const itineraryObjArr = await getXidInfo(itineraryOptions);
    window.itinerary123 = "hello";
    console.log(window.itinerary123);
    // display(itineraryObjArr, userCityDays);
  } catch (error) {
    console.log(error);
    return error;
  }
}

// control(userCategoriesFinal, userCityDays)

const apiCategoriesArrayMaker = userCategoriesFinal => {
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
    $.ajax({
      url: `https://api.opentripmap.com/0.1/en/places/xid/${array}?apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d`,
      method: "GET"
    }).then(response => {
      let xidDescripObj = {
        xid: response.xid,
        name: response.name,
        address: response.address.road,
        bio: response.wikipedia_extracts,
        image: response.preview,
        card: response.otm,
        url: response.url
      };

      xidInfoArr.push(xidDescripObj);
    });
  });

  for (let i = 0; i < 1; i++) {
    $("#cards").append(`<div class="card">
      <header class="card-header">
        <p class="card-header-title">
          Component
        </p>
        <a href="#" class="card-header-icon" aria-label="more options">
          <span class="icon">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </a>
      </header>
      <div class="card-content">
        <div class="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
          <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
          <br>
          <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item">Save</a>
        <a href="#" class="card-footer-item">Edit</a>
        <a href="#" class="card-footer-item">Delete</a>
      </footer>
    </div>`);
  }
};
