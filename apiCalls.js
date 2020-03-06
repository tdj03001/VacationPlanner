$(document).ready(function() {
  const location = () => {
    var testURL =
      "https://api.opentripmap.com/0.1/en/places/geoname?name=philadelphia&country=us&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d";
    $.ajax({
      url: testURL,
      method: "GET"
    }).then(function(response) {
      console.log("location call");
      console.log(response.name, response.lat, response.lon);
    });
  };

  const artMuseums = () => {
    var testURL =
      "https://api.opentripmap.com/0.1/en/places/autosuggest?name=art&radius=3000&lon=-75.1652&lat=39.9526&kinds=museums&rate=1&format=json&apikey=5ae2e3f221c38a28845f05b6e737a1bd4ae45f41add49b683ebf769d";

    $.ajax({
      url: testURL,
      method: "GET"
    }).then(function(response) {
      console.log("art museum call");
      console.log(response);
      console.log(response[0].name);
    });
  };

  location();
  artMuseums();
});
