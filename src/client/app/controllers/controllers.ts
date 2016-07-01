import "angular"
import ScheduleController from "./schedule-controller"

angular.module("angular-ts")
  .controller("ScheduleController", ["$scope", $scope => new ScheduleController($scope)])