$(document).ready(function () {

  $("#submitbutton").on("click", function () {
    event.preventDefault();
    var senderName = $("#namefield").val();
    var emailFrom = $("#emailfield").val();
    var emailBody = $("#messagefield").val();
    emailBody = emailBody + "%0A" + "%0A" + "Sender's Name: " + senderName + " | " + "  Sender's Email: " + emailFrom + "%0A";
    $("emailBody").append(emailFrom);

    window.location.href = "mailto:JNTenterprises4@gmail.com?&subject=Travel%20inquiry&body=" + emailBody;




  });


});