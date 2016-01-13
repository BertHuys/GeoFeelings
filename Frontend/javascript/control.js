var control = angular.module('control',['geolocation','googleservice']);
control.controller('control',function($scope,$http,geolocation,googleservice){
    $scope.formData ={};
    var coords ={};
    var long = 0;
    var lat = 0;
    $scope.formData.latitude = 3.250102;
    $scope.formData.longitude = 50.825078;

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