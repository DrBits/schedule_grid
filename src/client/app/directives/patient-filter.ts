import 'angular';
import { sortBy } from 'lodash';
import * as moment from 'moment';
import { patients } from '../domain/data';
import { Patient } from '../domain/patient';
import { appState, AppState } from '../app-state';
const ngTemplate = require('../templates/patient-filter.html') as string;
const patientFilterItemTemplate = require('../templates/patient-filter-item.html');
import * as XRegExp from 'xregexp';

angular.module('angular-ts').filter('patientFilter', () => (xs, s) => {
  if (/\d{15}/.test(s)) {
    return patients.filter(p => p.policyNumber === s);
  } else if (XRegExp('\\p{L}+\\s\\p{L}+').test(s)) {
    return patients.filter(
      p => p.name.toLowerCase().indexOf(s.toLowerCase()) !== -1
    );
  }
});

interface IPatientFilterScope extends ng.IScope {
  patients: Array<Patient>;
  searchPatient: (string) => void;
  formatDateTime: (string) => string;
  logout: () => void;
  appState: AppState;
  patientSelected: () => boolean;
  comparator: (x: any) => boolean;
  patientFilterItemTemplate: string;
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
    this.$scope = scope as IPatientFilterScope;
    this.$scope.patients = sortBy(patients, 'name');
    this.$scope.appState = appState;
    this.$scope.patientSelected = () => appState.selectedPatient instanceof Patient;
    this.$scope.patientFilterItemTemplate = patientFilterItemTemplate;
  }
}
