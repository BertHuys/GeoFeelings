var control = angular.module('control',['geolocation','googleservice']);
control.controller('control',function($scope,$http,$rootScope,geolocation,googleservice){
    $scope.formData ={};
    var coords ={};
    var long = 0;
    var lat = 0;
    $scope.formData.latitude = 3.250102;
    $scope.formData.longitude = 50.825078;

    geolocation.getLocation().then(function(data){

        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);


        googleservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    $scope.checkIn = function(){
        var checkInData = {
            username: $scope.formData.username,
            mood: $scope.formData.mood,
            location:[$scope.formData.longitude,$scope.formData.latitude],
            motivation: $scope.formData.motivation,
            htmlverified: $scope.formData.htmlverified
        };
        $http.post('/checkins',checkInData).success(function(data){
            $scope.formData.username="";
            $scope.formData.mood="";
            $scope.formData.motivation="";
            googleservice.refresh($scope.formData.latitude,$scope.formData.longitude );
        })
            .error(function(data){
                console.log('Error: ' + data);
            });
    };
});