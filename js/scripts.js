var locations = [];

$(function(){
  console.log('scripts loaded');

  var url = './js/restaurants.json'
  var restaurants = [];
  var i = 0;

// AJAX call to get data from json file
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    async: true,
    data: restaurants,
    success: function(restaurants){
      // Console log array of restaurant data
      console.log(restaurants);
      // Loop through each restaurant
      restaurants.forEach(function(restaurant){
        // Create locations array of restaurant name, latitude, longitude, year opened and array of cuisines
        locations[i] = [restaurant.restaurant.name, parseFloat(restaurant.restaurant.location.latitude, 10), parseFloat(restaurant.restaurant.location.longitude, 10), restaurant.restaurant.year_founded, restaurant.restaurant.cuisines]
        i++
      });
      // Set custom tick period
      Taucharts.api.tickPeriod.add("halfDecade", {
        cast: function (date) {
          // Get year opened
          var year = date.getFullYear();
          // Round year down to nearest half decade
          var nearestHalfDecade = year - year % 5;
          // Set tick period to nearest half decade
          return new Date(date.setFullYear(nearestHalfDecade + 4));
        },
        next: function (prevDate) {
          // Set next tick period to next half decade
          return new Date(prevDate.setFullYear(prevDate.getFullYear() + 5));
        }
      });
      // Set custom tick format
      Taucharts.api.tickFormat.add("halfDecade", function(x) {
        var d = new Date(x);
        // Set tick format to half decade, i.e. "2000 - 2014"
        return (d.getFullYear() + 1) + " - " + (d.getFullYear() + 5);
      });

      // Create bar chart of number of restaurants that opened in each year
      var chart = new Taucharts.Chart({
          guide: {
            x: {
              // Set x axis to custom tick period and tick format
              tickPeriod: 'halfDecade', tickFormat: 'halfDecade',
              label: {text: 'Time'}
            },
            y: {
              label: {text: 'Restaurant Openings'}
            },
            // Set color of bars
            color: {
              brewer: ['rgb(25, 0, 127)']
            }
          },
          data: _(restaurants)
            .chain()
            .reduce(function (memo, row) {
              // Initialize year variable as year opened number
              var year = parseFloat(row.restaurant.year_founded, 10);
              var nearestHalfDecade = "";
              // Define nearest half decade variable
              nearestHalfDecade += year - year % 5;
              // For restaurants opened in the same half decade...
        	    memo[nearestHalfDecade] = memo[nearestHalfDecade] || {
                // Set time as nearestHalfDecade
            	  time: nearestHalfDecade,
                // Initialize restaurantOpenings at 0
            	  restaurantOpenings: 0,
                // Initialize Restaurants as a string
                Restaurants: ""
        	    };
              // For each restaurant opened in same half decade, increase restaurantOpenings count
          	  memo[nearestHalfDecade].restaurantOpenings += 1;
              // For each restaurant opened in same half decade, add name to list of restaurants
              // Only the first restaurant is listed without a comma and space before it
              memo[nearestHalfDecade].Restaurants += memo[nearestHalfDecade].Restaurants == "" ? row.restaurant.name : ", " + row.restaurant.name;
        	  return memo;
            }, {})
            .values()
            .value(),
          dimensions: {
            // Set data dimensions
            'time': { type: 'order', scale: 'time' },
            'restaurantOpenings': { type: 'measure', scale: 'linear' },
          },
          // Bar graph type
          type: 'bar',
          // Assign time to x axis
          x: 'time',
          // Assign number of restaurant openings to y axis
          y: 'restaurantOpenings',
          plugins: [
            // Display time, number of restaurant openings and list of restaurants on tooltip
            Taucharts.api.plugins.get('tooltip')({
              fields: ['time', 'restaurantOpenings', 'Restaurants']
            })
          ]
      });
      // Render chart
      chart.renderTo('#chart');
    }
  });
});

// Console log locations array
console.log(locations);

// Google maps function
function initMap() {
  // Location for the center of the interactive map
  var franklinSt = {lat: 35.912749, lng: -79.0617988};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: franklinSt,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var infowindow = new google.maps.InfoWindow();

  var marker, j;

  // Time out function for locations array to be built before creating markers
  setTimeout(function(){
    // Initialize markers array
    var markers2 = [];
    // Loop through locations array
    for (j = 0; j < locations.length; j++) {
      // RGB values for each marker determined by the year opened
      var r = 25 + ((locations[j][3] - 1922) / 96) * (209);
      var g = 0 + ((locations[j][3] - 1922) / 96) * (229);
      var b = 127 + ((locations[j][3] - 1922) / 96) * (128);
      var icon = {
        // Custom SVG path for google marker
        path: 'M 34.07 1.75 C 24.44 -2.04 13.51 0.46 6.68 7.99 c -7.11 7.85 -8.79 17.98 -3.86 27.24 c 3.5 6.59 7.79 12.75 11.62 19.17 c 4.44 7.45 8.47 15.08 8.75 24.07 c 0.04 1.29 0.08 3.04 1.84 2.95 c 1.69 -0.09 1.64 -1.84 1.67 -3.13 c 0.2 -7.38 3.03 -13.93 6.62 -20.15 c 4.07 -7.05 8.48 -13.89 12.72 -20.84 c 2.38 -3.9 3.72 -8.14 3.83 -11.64 C 49.86 14.8 43.34 5.39 34.07 1.75 Z M 24.87 33.81 c -4.96 -0.04 -9.17 -4.49 -8.91 -9.43 c 0.24 -4.75 4.56 -8.72 9.31 -8.54 c 4.76 0.18 8.78 4.43 8.67 9.18 C 33.82 29.77 29.63 33.85 24.87 33.81 Z',
        // Fill color of each marker's custom RGB value
        fillColor: 'rgb(' + r + ', ' + g + ', ' + b + ')',
        fillOpacity: 1,
        // Anchors the marker at the bottom center, where the "point" is
        anchor: new google.maps.Point(27,86),
        scale: .5,
        strokeColor: 'rgb(25, 0, 127)',
        strokeWeight: 1
      };
      // Initialize cuisines variable to cuisines array within locations array
      var cuisines = locations[j][4];
      // Create marker for each location
      marker = new google.maps.Marker({
        // Set position to latitude and longitude of each location
        position: new google.maps.LatLng(locations[j][1], locations[j][2]),
        map: map,
        // Set category to cuisines array
        category: cuisines,
        // Set icon to marker SVG path with custom fill color
        icon: icon
      });

      // Add each marker to markers array
      markers2.push(marker);

      // Click event on each marker opens info window
      google.maps.event.addListener(marker, 'click', (function(marker, j) {
        return function() {
          // Change cuisines array into string joined by commas
          var cuisinesAsString = locations[j][4].join(', ');
          // Info window shows location name, year opened and cuisines on click
          infowindow.setContent('<h2>' + locations[j][0] + '</h2><p>Year opened: ' + locations[j][3] + '</p>' + '<p>Cuisine(s): ' + cuisinesAsString);
          infowindow.open(map, marker);
        }
      })(marker, j));
    }

    // Create filter by cuisine category
    filterMarkers = function(category) {
      // Loop through markers array
      for (i = 0; i < markers2.length; i++) {
        marker = markers2[i];

        // Show marker if one of its cuisines matches the cuisine selected or if no cuisine has been selected
        if((typeof marker.category == 'object' && marker.category.indexOf(category) >= 0) || category.length == 0){
          marker.setVisible(true);
        }
        // Hide marker if its cuisines don't match the cuisine selected
        else
        {
          marker.setVisible(false);
        }
      }
    }
  }, 1000)
}
