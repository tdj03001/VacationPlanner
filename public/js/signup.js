$(document).ready(function () {

  // When the signup button is clicked, we validate the email and password are not blank
  $("#signupBtn").on("click", function (event) {
    event.preventDefault();
    var userData = {
      email: $("#email-input").val().trim(),
      password: $("#password-input").val().trim(),
      name: $("#name-input").val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.name);
    $("#email-input").val("");
    $("#password-input").val("");
    $("#name-input").val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, name) {
    $.post("/api/signup", {
      email: email,
      password: password,
      name: name
    })
      .then(function (data) {
        window.location.replace("/main");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
