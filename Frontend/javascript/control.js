var control = angular.module('control',['geolocation','googleservice']);
control.controller('control',function($scope,$http,$rootScope,geolocation,googleservice){
    $scope.formData ={};
    var coords ={};
    var long = 0;
    var lat = 0;
    $scope.formData.latitude = 3.250102;
    $scope.formData.longitude = 50.825078;

    var geocoder = new google.maps.Geocoder;
   /* function geocodeLatLng(geocoder,latlng) {
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    alert(results[1].formatted_address);
                    return results[1].formatted_address;
                };

            } else {
                return "onbekend";
            }
        });
    }*/

    geolocation.getLocation().then(function(data){

        coords = {lat:data.coords.latitude, long:data.coords.longitude};
        $scope.formData.longitude = parseFloat(coords.long).toFixed(8);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(8);
        var latlng = new google.maps.LatLng(parseFloat(coords.long).toFixed(8),parseFloat(coords.lat).toFixed(8));

       geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    $scope.formData.place = results[1].formatted_address;
                    alert(results[1].formatted_address);
                };

            } else {
                return "onbekend";
            }
        });
        googleservice.refresh($scope.formData.latitude, $scope.formData.longitude, $scope.formData.place);



    });
    $rootScope.$on("clicked", function(){
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(googleservice.clickLat).toFixed(8);
            $scope.formData.longitude = parseFloat(googleservice.clickLong).toFixed(8);


            var latlng = new google.maps.LatLng(parseFloat(googleservice.clickLat).toFixed(8),parseFloat(googleservice.clickLong).toFixed(8));
            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK){
                    if (results[1]) {

                        alert(results[1].formatted_address);
                        $scope.formData.place =  results[1].formatted_address;
                    };

                } else {
                      return "onbekend";
                }
            });
        googleservice.refresh($scope.formData.latitude, $scope.formData.longitude, $scope.formData.place);
        });
    });

    $scope.checkIn = function(){
        var checkInData = {
            username: $scope.formData.username,
            mood: $scope.formData.mood,
            location:[$scope.formData.longitude,$scope.formData.latitude],
            motivation: $scope.formData.motivation,
            place: $scope.formData.place
        };
        $http.post('/checkins',checkInData).success(function(data){
            $scope.formData.username="";
            $scope.formData.mood="";
            $scope.formData.motivation="";
            $scope.formData.place="";
            googleservice.refresh($scope.formData.latitude,$scope.formData.longitude,$scope.formData.place );
        })
            .error(function(data){
                console.log('Error: ' + data);
            });
    };
});