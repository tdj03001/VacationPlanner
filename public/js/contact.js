$(document).ready(function () {

  $("#submitbutton").on("click", function () {
    event.preventDefault();
    var senderName = $("#namefield").val();
    var emailFrom = $("#emailfield").val();
    var emailBody = $("#messagefield").val();
    emailBody = emailBody + "%0A" + "%0A" + "Sender's Name: " + senderName + " | " + "  Sender's Email: " + emailFrom + "%0A";
    $("emailBody").append(emailFrom);
<<<<<<< HEAD
    window.location.href = "mailto:JNTenterprises4@gmail.com?&subject=Travel%20inquiry&body=" + emailBody;


=======

    window.location.href = "mailto:JNTenterprises4@gmail.com?&subject=Travel%20inquiry&body=" + emailBody;




>>>>>>> 7178aef901a30b22d8411c39dc2fc6d0f21fd7fb
  });


});