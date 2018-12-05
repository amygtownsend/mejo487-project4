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
          locations[i] = [restaurant.restaurant.name, parseFloat(restaurant.restaurant.location.latitude, 10), parseFloat(restaurant.restaurant.location.longitude, 10), restaurant.restaurant.year_founded, restaurant.restaurant.cuisines]
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
    var markers2 = [];
    for (j = 0; j < locations.length; j++) {
      var cuisines = locations[j][4];
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[j][1], locations[j][2]),
        map: map,
        category: cuisines
      });

      markers2.push(marker);

      google.maps.event.addListener(marker, 'click', (function(marker, j) {
        return function() {
          var cuisinesAsString = locations[j][4].join(', ');
          infowindow.setContent('<h2>' + locations[j][0] + '</h2><p>Year opened: ' + locations[j][3] + '</p>' + '<p>Cuisine(s): ' + cuisinesAsString);
          infowindow.open(map, marker);
        }
      })(marker, j));
    }

    filterMarkers = function(category) {
      for (i = 0; i < markers2.length; i++) {
        marker = markers2[i];

        // If is same category or category not picked
        if((typeof marker.category == 'object' && marker.category.indexOf(category) >= 0) || category.length == 0){
          marker.setVisible(true);
        }
        // Categories don't match
        else
        {
          marker.setVisible(false);
        }
      }
    }

    initialize();
  }, 1000)
}
