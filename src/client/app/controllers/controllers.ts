import 'angular';
import ScheduleController from './schedule-controller';
import ConfirmModalController from './confirm-modal';
import AppointmentModalController from './appointment-modal';

angular.module('angular-ts')
  .controller('ScheduleController', ['$scope', $scope => new ScheduleController($scope)])
  .controller('confirmModalController', ($scope, $uibModalInstance) =>
    new ConfirmModalController($scope, $uibModalInstance))
  .controller('appointmentModalController', ($scope, $uibModalInstance) =>
    new AppointmentModalController($scope, $uibModalInstance));
