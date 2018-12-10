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
      var r = 25 + ((locations[j][3] - 1922) / 96) * (209);
      var g = 0 + ((locations[j][3] - 1922) / 96) * (229);
      var b = 127 + ((locations[j][3] - 1922) / 96) * (128);
      var icon = {
        path: 'M 34.07 1.75 C 24.44 -2.04 13.51 0.46 6.68 7.99 c -7.11 7.85 -8.79 17.98 -3.86 27.24 c 3.5 6.59 7.79 12.75 11.62 19.17 c 4.44 7.45 8.47 15.08 8.75 24.07 c 0.04 1.29 0.08 3.04 1.84 2.95 c 1.69 -0.09 1.64 -1.84 1.67 -3.13 c 0.2 -7.38 3.03 -13.93 6.62 -20.15 c 4.07 -7.05 8.48 -13.89 12.72 -20.84 c 2.38 -3.9 3.72 -8.14 3.83 -11.64 C 49.86 14.8 43.34 5.39 34.07 1.75 Z M 24.87 33.81 c -4.96 -0.04 -9.17 -4.49 -8.91 -9.43 c 0.24 -4.75 4.56 -8.72 9.31 -8.54 c 4.76 0.18 8.78 4.43 8.67 9.18 C 33.82 29.77 29.63 33.85 24.87 33.81 Z',
        fillColor: 'rgb(' + r + ', ' + g + ', ' + b + ')',
        fillOpacity: 1,
        anchor: new google.maps.Point(27,86),
        scale: .5,
        strokeColor: 'rgb(25, 0, 127)',
        strokeWeight: 1
      };
      var cuisines = locations[j][4];
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[j][1], locations[j][2]),
        map: map,
        category: cuisines,
        icon: icon
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
  }, 1000)
}
