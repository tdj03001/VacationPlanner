$(document).ready(function () {
  let userCityDays;
  let userCategories;
  let userCategoriesArr;
  let userCategoriesFinal;
  $("#submit").on("click", function () {
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
    // debugger;
    const categories = await apiCategoriesArrayMaker(userCategoriesFinal);
    const coordinates = await getCoordinates(userCityDays);
    const apiData = await apiCall(categories, coordinates);
    const itineraryOptions = await itineraryData(apiData, userCityDays);
    const itineraryObjArr = await getXidInfo(itineraryOptions);

    display(itineraryObjArr, userCityDays);
  } catch (error) {
    console.log(error);
    return error;
  }
}

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
  }).then(function (response) {
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
    for (var i = 0; i <= userCityDays.days; i++) {
      xidArr.push(array[i].xid);
    }
  });
  return xidArr;
};

const getXidInfo = xidArr => {
  return new Promise((resolve, reject) => {
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
          image: response.image,
          card: response.otm,
          url: response.url
        };
        xidInfoArr.push(xidDescripObj);
        if (xidInfoArr.length === xidArr.length) {
          resolve(xidInfoArr);
        }
      });
    });
  });
};

const saveItem = data => {
  $.post("/api/itinerary_create", data, function () { });
};

//////////////////////DISPLAY ITINERARY FUNCTIONS//////////////////////////
function display(itineraryObjArr, userCityDays) {
  for (let i = 1; i <= parseInt(userCityDays.days); i++) {
    $("#itinerary").append(`<br><div id="day-${i}"><p style="color:black;font-size:30px;">Day ${i}</p></div>`);
  }

  let j = 1;
  for (let i = 0; i <= itineraryObjArr.length; i++) {
    console.log(itineraryObjArr);
    console.log(typeof userCityDays.days);

    let days = parseInt(userCityDays.days);

    if (j <= days) {
      $(`#day-${j}`)
        .append(`<br><br><style> body {background-color: rgb(216, 221, 224);}</style>
<div class="card">
    <header class="card-header">
      <p class="card-header-title">
        ${itineraryObjArr[i].name}
      </p>
      <a href="#" class="card-header-icon" aria-label="more options">
        
      </a>
    </header>
    <div class="card-content">
      <div class="content">
       Address: ${itineraryObjArr[i].address} <br>
       OTM: ${itineraryObjArr[i].card}
      </div>
    </div>
    <footer class="card-footer">
      <a class="card-footer-item save" id="${itineraryObjArr[i].xid}">Save</a>
      <a class="card-footer-item del" id="${itineraryObjArr[i].xid}">Delete</a>
    </footer>
  </div>`);
      j++;
    } else if ((j = days)) {
      j = 1;
    }
  }
  $(".save").on("click", function () {
    event.preventDefault();
    saveItem({ xid: this.id });
  });
}
