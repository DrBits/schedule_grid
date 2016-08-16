import 'angular';
import * as moment from 'moment';

interface IAppointmentModalControllerScope extends ng.IScope {
  time: string;
}

export default class AppointmentModalController {
  $scope: IAppointmentModalControllerScope;
  instance: angular.ui.bootstrap.IModalServiceInstance;

  constructor($scope, $uibModalInstance) {
    this.$scope = $scope;
    this.instance = $uibModalInstance;
    this.$scope.time = moment($scope.$resolve.activity.time).format();
  }
}
