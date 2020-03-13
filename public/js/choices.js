$(document).ready(function () {

control(userCategoriesFinal, userCityDays);

const display = (itineraryObjArr, userCityDays) => {
  console.log("in choices.js");
  console.log(itineraryObjArr, userCityDays);


  for (let i = 0; i < 3; i++) {
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

  
$.get("/itinerary").then(function(data){
  console.log("data")
  console.log(data)
  // control(userCategoriesFinal, userCityDays);
  // window.location.replace("/choices.html")
});


// const loadChoiceshtml = () => {

//   $.get("/itinerary").then(function (data) {

//     window.location.replace("/choices.html")
//   });
// }

// display(itineraryObjArr, userCityDays);
// loadChoiceshtml();



  //xid (id on card)and day need to be be attached to 

});