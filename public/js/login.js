$(document).ready(function () {

  // When the form is submitted, we validate there's an email and password entered
  $("#loginBtn").on("click", function (event) {
    event.preventDefault();
    var userData = {
      email: $("#email-input").val().trim(),
      password: $("#password-input").val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    $("#email-input").val("");
    $("#password-input").val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(function () {
        window.location.replace("/main");
        // If there's an error, log the error
      })
      .catch(function (err) {
        console.log(err);
      });
  }
});
