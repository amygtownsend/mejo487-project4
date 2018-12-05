var locations = [];

$(function(){
  console.log('scripts loaded');

  var url = './js/restaurants.json'
  var restaurants = [];
  var i = 0;


  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    async: true,
    data: restaurants,
    success: function(restaurants){
      console.log(restaurants);
      restaurants.forEach(function(restaurant){
        if (restaurant.restaurant.year_founded !== "closed") {
          locations[i] = [restaurant.restaurant.name, parseFloat(restaurant.restaurant.location.latitude, 10), parseFloat(restaurant.restaurant.location.longitude, 10), restaurant.restaurant.year_founded];
          var cuisines = restaurant.restaurant.cuisines;
          var h;
          for (h = 0; h < cuisines.length; h++) {
            locations[i][h + 4] = cuisines[h];
          }
          i++
        }
      });
    }
  });
});

console.log(locations);

function initMap() {
  var franklinSt = {lat: 35.912749, lng: -79.0617988};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: franklinSt,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var infowindow = new google.maps.InfoWindow();

  var marker, j;

  setTimeout(function(){
    for (j = 0; j < locations.length; j++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[j][1], locations[j][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, j) {
        return function() {
          infowindow.setContent('<h2>' + locations[j][0] + '</h2><p>Year added: ' + locations[j][3] + '</p>');
          infowindow.open(map, marker);
        }
      })(marker, j));
    }
  }, 1000)
}
