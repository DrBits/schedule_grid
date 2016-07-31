import 'angular';

interface IScheduleControllerScope extends ng.IScope {
}

export default class FilterController {
  $scope: IScheduleControllerScope;

  constructor($scope) {
    this.$scope = $scope;
  }
}
