import 'angular';
import { AppState, appState } from '../app-state';
const ngTemplate = require('../templates/record-date.html') as string;

interface IRecordDateScope extends ng.IScope {
  open2: () => void;
  popup2: boolean;
  format: string;
  dateOptions: any;
  appState: AppState;
}

export default class RecordDate implements ng.IDirective {
  scope: IRecordDateScope;
  $scope: IRecordDateScope;

  public template: string = ngTemplate;

  private open2: () => void = () => {
    this.$scope.popup2 = true;
    this.$scope.dateOptions = {
      formatYear: 'yy',
      minDate: new Date(),
      startingDay: 1
    };
  };

  public link(scope: IRecordDateScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) {
    this.$scope = this.scope = scope;
    this.$scope.open2 = this.open2;
    this.$scope.format = 'dd-MM-yyyy';
    this.$scope.appState = appState;
  }
}
