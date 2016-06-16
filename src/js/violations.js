require("angular/angular.min");

var app = angular.module("violations",[]);

app.controller("ViolationsController", function($scope) {

	$scope.violationsData = violationsData;
	$scope.max = 9254;

});
