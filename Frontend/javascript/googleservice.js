angular.module('googleservice', [])
    .factory('googleservice', function($rootScope,$http){

        var googleMapService = {};
        var locations = [];
        var lastMarker;
        var currentSelectedMarker;
        var selectedLat = 3.250102;
        var selectedLong = 50.825078;
        var selectedPlace = "test";
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;


        googleMapService.refresh = function(latitude, longitude){
            locations = [];

            selectedLat = latitude;
            selectedLong = longitude;

            $http.get('/checkins').success(function(response){
                locations = convertToMapPoints(response);
                initialize(latitude, longitude);
            }).error(function(){});
        };



        var convertToMapPoints = function(response){
            var locations = [];
            for(var i= 0; i < response.length; i++) {
                var checkin = response[i];
                var  contentString =
                    '<p><b>Username</b>: ' + checkin.username +
                        '<br><b>Mood</b>: ' + checkin.mood +
                        '<br><b>Motivation</b>: ' + checkin.motivation +
                        '<br><b>Place</b>: '+checkin.place +
                        '</p>';
                locations.push({
                    latlon: new google.maps.LatLng(checkin.location[1], checkin.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: checkin.username,
                    mood: checkin.mood,
                    motivation: checkin.motivation,
                    place: checkin.place
                });
            }
            return locations;
        };
        var initialize = function(latitude, longitude) {
            var myLatLng = {lat: selectedLat, lng: selectedLong};
            if (!map){
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: myLatLng
                });
            }
            locations.forEach(function(n, i){
                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: map,
                    title: "Big Map",
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });
                google.maps.event.addListener(marker, 'click', function(e){
                    currentSelectedMarker = n;
                    n.message.open(map, marker);
                });
            });
            var initialLocation = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({
                position: initialLocation,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            lastMarker = marker;

            map.panTo(new google.maps.LatLng(latitude, longitude));


            google.maps.event.addListener(map, 'click', function(e){
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });


                if(lastMarker){
                    lastMarker.setMap(null);
                }


                lastMarker = marker;
                map.panTo(marker.position);

                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");
            });
        };

        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(selectedLat, selectedLong, selectedPlace));

        return googleMapService;
    });