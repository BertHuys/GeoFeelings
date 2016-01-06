/**
 * Created by BERT on 3/01/16.
 */
var control = angular.module('control',['geolocation']);
control.controller('control',function($scope,$http,geolocation){
    $scope.formData ={};
    var coords ={};
    var long = 0;
    var lat = 0;

    $scope.checkIn = function(){
        var checkInData = {
            username: $scope.formData.username,
            mood: $scope.formData.mood,
            motivation: $scope.formData.motivation
        };
        $http.post('/checkins',checkInData).success(function(data){
            $scope.formData.username="";
            $scope.formData.mood="";
            $scope.formData.motivation="";
        })
            .error(function(data){
                console.log('Error: ' + data);
            });
    };
});