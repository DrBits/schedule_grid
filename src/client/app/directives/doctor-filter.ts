import 'angular';
import { AppState, appState } from '../app-state';
import { doctors } from '../domain/data';
import { Doctor } from '../domain/doctor';
import { groupBy, sortBy } from 'lodash';
import FilterController from '../controllers/schedule-controller';
const ngTemplate = require('../templates/doctor-filter.html');

enum ShowBy {
  alphabet = 'alphabet' as any as ShowBy,
  specialization = 'specialization' as any as ShowBy
}

interface IDoctorFilterScope extends ng.IScope {
  doctors: Array<Doctor>;
  doctorsBySpecialization: {[specialization: string]: Array<Doctor>};
  showBy: ShowBy;
  selectAll: () => void;
  deselectAll: () => void;
  appState: AppState;
  allSelected: (string) => boolean;
  selectAllBySpec: (string, boolean) => void;
  selectedDoctor: Doctor | void;
  countSelected: () => number;
}

export default class DoctorFilter implements ng.IDirective {
  $scope: IDoctorFilterScope;
  replace = true;
  require = '^schedules';
  restrict = 'E';
  controller: FilterController;

  public templateUrl: string = ngTemplate;

  private selectAll: () => void = () => doctors.forEach(d => d.visible = true);

  private allSelected: (string) => boolean = (spec) =>
    doctors.filter(d => d.specialization === spec).reduce((a, b) => a && b.visible, true);

  private selectAllBySpec: (string, boolean) => void = (spec, select) =>
    doctors.filter(d => d.specialization === spec).forEach(d => d.visible = select);

  private deselectAll: () => void = () => doctors.forEach(d => d.visible = false);

  private selectOnly: (Doctor) => void = (d) => {
    this.deselectAll();
    d.visible = true;
  };

  private countSelected: () => number = () => doctors.filter(d => d.visible).length;

  public link(scope: IDoctorFilterScope,
              element: ng.IAugmentedJQuery,
              attributes: ng.IAttributes,
              filterController: FilterController) {
    this.$scope = scope as IDoctorFilterScope;
    this.$scope.doctors = sortBy(doctors, 'name');
    this.$scope.doctorsBySpecialization = groupBy(doctors, 'specialization');
    this.$scope.showBy = ShowBy.alphabet;
    this.controller = filterController;
    scope.selectAll = this.selectAll;
    scope.deselectAll = this.deselectAll;
    scope.appState = appState;
    scope.allSelected = this.allSelected;
    scope.selectAllBySpec = this.selectAllBySpec;
    scope.countSelected = this.countSelected;

    scope.$watch('selectedDoctor', (d: string | Doctor) => d instanceof Doctor && this.selectOnly(d));
  }
}
