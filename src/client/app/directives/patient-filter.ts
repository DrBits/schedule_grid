import 'angular';
import { sortBy } from 'lodash';
import * as moment from 'moment';
import { patients } from '../domain/data';
import { Patient } from '../domain/patient';
import { appState, AppState } from '../app-state';
const ngTemplate = require('../templates/patient-filter.html') as string;

interface IPatientFilterScope extends ng.IScope {
  patients: Array<Patient>;
  searchPatient: (string) => void;
  formatDateTime: (string) => string;
  logout: () => void;
  appState: AppState;
}

export default class PatientFilter implements ng.IDirective {
  scope: IPatientFilterScope;
  $scope: IPatientFilterScope;

  public templateUrl: string = ngTemplate;

  private formatDateTime: (string) => string = (datetime) => {
    return moment(datetime).format('MM.DD.YYYY');
  };

  private logout: () => void = () => {
    this.$scope.appState.selectedPatient = undefined;
  };

  private searchPatient: (string) => void = (input) => {
    if (!!input) {
      const matches: RegExpMatchArray = input.match(/[a-zа-я][^\d\s]+[a-zа-я]/ig);
      if (matches && matches.length >= 2) {
        const inputStr: string = matches.join(' ');
        this.$scope.appState.selectedPatient =
          patients.filter(patient => patient.name.toLowerCase().indexOf(inputStr.toLowerCase()) !== -1)[0];
      } else if (input.match(/^\d{16}$/)) {
        this.$scope.appState.selectedPatient = patients.filter((item) => item.policyNumber === input)[0];
      } else {
        this.$scope.appState.selectedPatient = undefined;
      }
    }
  };

  public link(scope: IPatientFilterScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) {
    this.$scope = this.scope = scope;
    this.$scope.searchPatient = this.searchPatient;
    this.$scope.logout = this.logout;
    this.$scope.formatDateTime = this.formatDateTime;
    this.$scope = <IPatientFilterScope>scope;
    this.$scope.patients = sortBy(patients, 'name');
    this.$scope.appState = appState;
  }
}
