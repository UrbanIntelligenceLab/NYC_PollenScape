//Leaflet Map integrating with CARTO:
    var map = new L.Map('map', { 
      drawControl: true,
      center: [40.75, -73.9534],
      zoom: 11,
      minZoom: 10,
      maxZoom: 15
    });

    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);


    //Locate Me        
    var x = document.getElementById("demo");
    var marker = 0

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else { x.innerHTML = "Geolocation is not supported by this browser.";}};

    function showPosition(position) {
      map.setView( {lat:position.coords.latitude, lng:position.coords.longitude}, 16)
      marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
    };

    
    var layerUrl = 'https://yuanlai22.carto.com/api/v2/viz/adebe94a-0881-4869-b86f-9d4befe1a190/viz.json';
    
    cartodb.createLayer(map, layerUrl)
      .addTo(map)
      .on('done', function(layer) {
        // get our lone sublayer from the carto layer object
        var trees = layer.getSubLayer(1);

        var nta = layer.getSubLayer(2);
        console.log(nta)
        nta.hide();

        //layer.on('load', function() {
          //console.log('LOADED')
        //})

        // event listeners to change the SQL for the carto layer
        $('.spring').on('click', function() {
          trees.setSQL('SELECT * FROM street_trees_190123 WHERE spring = 1');
          $('.summer').removeClass('highlight');
          $('.fall').removeClass('highlight');
          $('.winter').removeClass('highlight');
          $(this).toggleClass("highlight");
        });

        $('.summer').on('click', function() {
          trees.setSQL('SELECT * FROM street_trees_190123 WHERE summer = 1');
          $('.spring').removeClass('highlight');
          $('.fall').removeClass('highlight');
          $('.winter').removeClass('highlight');
          $(this).toggleClass("highlight");
        });

        $('.fall').on('click', function() {
          trees.setSQL('SELECT * FROM street_trees_190123 WHERE fall = 1');
          $('.spring').removeClass('highlight');
          $('.summer').removeClass('highlight');
          $('.winter').removeClass('highlight');
          $(this).toggleClass("highlight");
        });

        $('.winter').on('click', function() {
          trees.setSQL('SELECT * FROM street_trees_190123 WHERE winter = 1');
          $('.spring').removeClass('highlight');
          $('.summer').removeClass('highlight');
          $('.fall').removeClass('highlight');
          $(this).toggleClass("highlight");
        });

        $('.reset').on('click', function() {
          trees.setSQL('SELECT * FROM street_trees_190123');
          $('.spring').removeClass('highlight');
          $('.summer').removeClass('highlight');
          $('.fall').removeClass('highlight');
          $('.winter').removeClass('highlight'); 
          if (marker !=0){
            nta.hide();
          }
          if (neighborhood==1){
            nta.hide();
            neighborhood = 0
          }
          
          map.removeLayer(marker);
          map.setView({lat:40.75, lng:-73.9534}, 11);
        });

        var neighborhood = 0

        $('.neighborhood').on('click', function() {
          if (neighborhood == 0){
            nta.show();
            neighborhood = 1
          } else {
            nta.hide();
            neighborhood = 0
          }
        //console.log('clicked')   
        // $(this).toggleClass("highlight");
         });

        $('.citywide').on('click', function() {
        //console.log('clicked')
        nta.hide();
        map.setView( {lat:40.75, lng:-73.9534}, 11);
        });
        // }).on('error', function() {
        //log the error
        });




