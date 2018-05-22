$(document).ready(function() {
  $("#getMessage").on("click", function() {
    $.getJSON(
      "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&key=&format=jsonp&jsonp=?",
      function(json) {
        var quote = json.quoteText;
        var author = json.quoteAuthor;

        $("#message").html("<p>" + quote + "</p>");

        if (author === "") {
          $("#author").html("<p>Unknown Author</p>");
        } else {
          $("#author").html("<p>" + author + "</p>");
        }

        if (quote.length <= 140)
          $("#tweetIt").css({ "background-color": "green" });
        else {
          $("#tweetIt").css({ "background-color": "red" });
   
        }
      }
    );
  });

  $("#tweetIt").on("click", function() {
    var tweetText = $("#message").text();
    var tweetMod = tweetText.replace(/;/g, "%3B");
    if (tweetText.length <=140)
    window.open(
      "https://twitter.com/intent/tweet?text=" + tweetMod,
      (width = 200)    );
    else {};
  });
});