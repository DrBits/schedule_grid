import 'angular';
import { Doctor } from '../domain/doctor';
import * as moment from 'moment';
import { autobind } from 'core-decorators';
import * as $ from 'jquery';
import ScheduleController from '../controllers/schedule-controller';
import { TimeRange } from '../util/time-range';
import { Activity, activityDescriptions, ActivityType } from '../domain/activities';
import { appState, AppState } from '../app-state';
import { Patient } from '../domain/patient';
const ngTemplate = require('../templates/individual-schedule.html') as string;

declare interface IActivityAtTime {
  time: moment.Moment;
  activity: Activity;
}

interface IIndividualScheduleScope extends ng.IScope {
  date: Date;
  doctor: Doctor;
  prettyDate: string;
  scrollRef: Element;
  shouldCollapse: () => boolean;
  collapse: boolean;
  scrollPos: number;
  expand: () => void;
  forceExpand: boolean;
  strutHeight: number;
  scrollTo: (string) => void;
  activityDescriptions: {[key: string]: string};
  appState: AppState;
  expired: (Moment) => boolean;
  menuOptions: (Doctor) => (IActivityAtTime) => Array<[string, Function] | void>;
}

export default class IndividualSchedule implements ng.IDirective {
  scope = {
    doctor: '=',
    date: '=',
    scrollRef: '=',
    scrollPos: '=',
    strutHeight: '='
  };

  $scope: IIndividualScheduleScope;
  controller: ScheduleController;
  replace = true;
  require = '^schedules';
  private humanReadableSchedule: Element;
  private strut: Element;
  private scheduleHeader: Element;
  private $timeout: ng.ITimeoutService;

  constructor($timeout) {
    this.$timeout = $timeout;
  }

  public templateUrl = ngTemplate;

  private expand: () => () => void = () => {
    const scope = this.$scope;
    const header = this.scheduleHeader;
    return () => scope.forceExpand = true;
  };

  private shouldCollapse: () => () => boolean = () => {
    const hrs = this.humanReadableSchedule;
    const scope = this.$scope;
    return () => {
      if (scope.forceExpand) {
        setTimeout(() => {
          scope.forceExpand = false;
        }, 500);
        return false;
      }
      return (
        (this.strut.clientHeight - scope.scrollPos) <
        (<HTMLDivElement><any>hrs).offsetTop + hrs.clientHeight / 2
      );
    };
  };

  @autobind
  private scrollTo(time: string) {
    const tr = new TimeRange(time);
    const e = $(this.$scope.scrollRef).find(`[data-time='${tr.since.toString()}']`)[0];
    const newScrollPos = e.offsetTop - this.$scope.strutHeight;
    $(this.$scope.scrollRef).animate({ scrollTop: newScrollPos }, 100);
  }

  private deleteAppointment(a: Activity) {

  }

  public link(scope: IIndividualScheduleScope,
              element: ng.IAugmentedJQuery,
              attrs: ng.IAttributes,
              ctl: ScheduleController) {
    scope.prettyDate = moment(scope.date).locale('ru').format('dd. DD MMM');
    this.humanReadableSchedule = element[0].querySelector('.human-readable-schedule');
    this.scheduleHeader = element[0].querySelector('.schedule-header-doctor');
    this.strut = element[0].querySelector('.strut');
    this.$scope = scope;

    scope.shouldCollapse = this.shouldCollapse();
    scope.expand = this.expand();
    scope.forceExpand = false;
    scope.scrollTo = this.scrollTo;
    scope.activityDescriptions = activityDescriptions;
    scope.appState = appState;
    scope.expired = m => m.isBefore(moment());
    scope.menuOptions = (doctor: Doctor) => (a: IActivityAtTime) => {
      if (a.activity.activity === ActivityType.availableForAppointments &&
        !!this.$scope.appState.selectedPatient && !this.$scope.expired(a.time)
      ) {
        return [
          [
            'Добавить запись',
            ({ a }) => doctor.addAppointment(a.time, <Patient>this.$scope.appState.selectedPatient)
          ]
        ];
      } else if (a.activity.activity === ActivityType.appointment && !this.$scope.expired(a.time)) {
        return [['Удалить запись', ({ a }) => doctor.deleteAppointment(a)]];
      } else {
        return [];
      }
    };
  }
}
