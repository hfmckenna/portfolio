// global object to make temperature value global, allows onClick HTML to change temperature format
var temp = {
    "celc" : '',
    "fahr" : ''
}

function geoFindMe() {
//outputs for various values from weather API JSON
  var iconSet = document.getElementById("iconOut");
  var detailsSet = document.getElementById("detailsOut");
  var locationSet = document.getElementById("locationOut");
  var tempCalc = document.getElementById("tempOut");
//closes function if geolocation not triggered in browser
  if (!navigator.geolocation){
    detailsSet.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
//callback function from geolocation success
  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

  $.getJSON(
      "https://fcc-weather-api.glitch.me/api/current?lat="+latitude+"&lon="+longitude,
      function (json){
        temp.celc = Math.round(json.main.temp);
        temp.fahr = Math.round(json.main.temp*1.8+32);
        var weatherDesc = json.weather[0].description;
        var weatherIcon = json.weather[0].id;
        var city = json.name;
        var time = new Date();
        tempCalc.innerHTML = temp.celc+"°";
        iconSet.innerHTML = '<img src="https://www.lfo.agency/projects/weather/images/'+weatherIcon+'.svg">';
        detailsSet.innerHTML = weatherDesc;
        locationSet.innerHTML = time.getHours()+":00, "+city;
       document.body.style.backgroundImage = "url('https://www.lfo.agency/projects/weather/images/"+weatherIcon.toString().substr(0, 1)+".jpg')";
      })
  };
  
  function error() {
    detailsSet.innerHTML = "Unable to retrieve your location";
  }

  detailsSet.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
};
function tempCelc(){document.getElementById("tempOut").innerHTML = temp.celc+"°"; return;};
function tempFahr(){document.getElementById("tempOut").innerHTML = temp.fahr+"°"; return;};