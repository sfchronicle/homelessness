require("angular/angular.min");

// bar graph -------------------------------------------------------------------

var app = angular.module("costs-aggregate",[]);

app.controller("CostsAggregateController",["$scope", "$filter", function($scope) {

  $scope.costsData = costsData;
  $scope.max_cost_total = 148603244;
  $scope.max_avg_total = 149273;

  $scope.selectedTable = "totals";
  $scope.lastSort = "order2";
  $scope.selectSort = "order2";
  $scope.sortOrder = 1;

  $scope.sortTable = function(selectSort) {

    $scope.selectSort = selectSort;

    if ($scope.lastSort == selectSort) {
      $scope.sortOrder *= -1;
    } else {
      $scope.lastSort = selectSort;
      $scope.sortOrder = 1;
    }

    $scope.costsData.sort(function(a, b) {
      if ($scope.selectedTable == "totals") {
        a = a.order1;
        b = b.order1;
      } else {
        a = a.order2;
        b = b.order2;
      }

      if (a > b) {
        return 1 * $scope.sortOrder;
      } else if (a < b) {
        return -1 * $scope.sortOrder;
      } else if (a == b) {
        return 0;
      }
    });

  };

}]);
