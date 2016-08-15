import 'angular';

interface IConfirmModalControllerScope extends ng.IScope {

}

export default class ConfirmModalController {
  $scope: IConfirmModalControllerScope;
  instance: angular.ui.bootstrap.IModalServiceInstance;

  constructor($scope, $uibModalInstance) {
    this.$scope = $scope;
    this.instance = $uibModalInstance;

    console.log('scope:', $scope);
  }
}
