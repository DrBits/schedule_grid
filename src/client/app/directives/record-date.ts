import 'angular';
import { AppState, appState } from '../app-state';
import { doctors } from '../domain/data';
import { ActivityType } from '../domain/activities';
const ngTemplate = require('../templates/record-date.html') as string;
import * as moment from 'moment';

interface IRecordDateScope extends ng.IScope {
  open2: () => void;
  popup2: boolean;
  format: string;
  dateOptions: any;
  appState: AppState;
  getDateClass: (d: {date: Date, mode: string}) => string;
  noneSelected: () => boolean;
}

const OR = (a, b) => a || b;

export default class RecordDate implements ng.IDirective {
  scope: IRecordDateScope;
  $scope: IRecordDateScope;

  public templateUrl: string = ngTemplate;

  public dateHasFreeSlots(date: Date): boolean {
    return moment(date).startOf('day')
        .isBefore(
          moment().startOf('day').add(2, 'weeks')
        ) && (
        doctors.filter(d => d.visible)
          .map(
            doctor =>
            doctor.getSchedule(date)
              .filter(
                ({ time, activity }) =>
                activity.activity === ActivityType.availableForAppointments
              )
              .length > 0
          ).reduce(OR, false)
      );
  }

  private getDateClass: (d: {date: Date, mode: string}) => string = ({ date, mode }) =>
    mode === 'day' && this.dateHasFreeSlots(date) ? 'dateClass' : '';

  private open2: () => void = () => {
    this.$scope.popup2 = true;
    this.$scope.dateOptions = {
      formatYear: 'yy',
      minDate: new Date(),
      startingDay: 1,
      customClass: this.scope.getDateClass
    };
  };

  public link(scope: IRecordDateScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) {
    this.$scope = this.scope = scope;
    this.$scope.open2 = this.open2;
    this.$scope.format = 'dd-MM-yyyy';
    this.$scope.appState = appState;
    this.$scope.getDateClass = this.getDateClass;

    this.$scope.noneSelected = () => doctors.filter(d => d.visible).length === 0;
  }
}
