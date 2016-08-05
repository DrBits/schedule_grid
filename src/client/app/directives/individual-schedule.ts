import 'angular';
import { Doctor } from '../domain/doctor';
import * as moment from 'moment';
import { autobind } from 'core-decorators';
import * as $ from 'jquery';
import ScheduleController from '../controllers/schedule-controller';
import { TimeRange } from '../util/time-range';
import { Activity, activityDescriptions, ActivityType, Appointment } from '../domain/activities';
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
  patientSelected: () => boolean;
  addAppointment: (doctor, time, patient) => void;
  tooltips: {
    free: string,
    expired: string,
    appointed: string
  };
  tooltip: (a) => string;
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
  private $sce: ng.ISCEService;

  constructor($timeout, $sce) {
    this.$timeout = $timeout;
    this.$sce = $sce;
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

  private showAppointment(doctor, {activity}) {
    setTimeout(() => alert(
`
 Время: ${moment(activity.time).format()}
 
 Врач:
  ${doctor.name}
  ${doctor.facility}
  ${doctor.roomNumber}
 
 Пациент:
   ${activity.patient.name}
   ${activity.patient.birthDate}
   ${activity.patient.policyNumber}
`
    ));
  }

  private addAppointment(doctor, time, patient) {
    if (confirm('Добавить запись?')) {
      doctor.addAppointment(time, patient);
      setTimeout(() => alert('Запись добавлена'));
    }
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
    scope.patientSelected = () => appState.selectedPatient instanceof Patient;
    scope.addAppointment = this.addAppointment;
    scope.tooltips = {
      expired: this.$sce.trustAsHtml('<div>Запись на прошедший<br/>временной интервал<br/>недоступна</div>'),
      appointed: this.$sce.trustAsHtml('<div>Временной интервал занят</div>'),
      free: this.$sce.trustAsHtml('<div>Время доступно для<br/>предварительной записи</div>')
    };
    scope.tooltip = (a) => {
      return (!!appState.selectedPatient ?
        ( a.activity.activity === 'availableForAppointments' ?
            scope.expired(a.time) ? scope.tooltips.expired : scope.tooltips.free
            :
            a.activity.activity === 'appointment' ?
              scope.tooltips.appointed
              : ''
        )
        : '');
    };
    scope.menuOptions = (doctor: Doctor) => (a: IActivityAtTime) => {
      if (
        a.activity.activity === ActivityType.availableForAppointments &&
        !!this.$scope.appState.selectedPatient &&
        !this.$scope.expired(a.time)
      ) {
        return [
          [
            'Создать запись',
            ({ a }) =>
              this.addAppointment(doctor, a.time, <Patient>this.$scope.appState.selectedPatient)
          ]
        ];
      } else if (a.activity.activity === ActivityType.appointment && !this.$scope.expired(a.time)) {
        return [
          ['Отменить', ({ a }) => doctor.deleteAppointment(a)],
          ['Показать', ({ a }) => this.showAppointment(doctor, a)]
        ];
      } else if (a.activity.activity === ActivityType.appointment) {
        return [
          ['Показать', ({ a }) => this.showAppointment(doctor, a)]
        ];
      } else {
        return [];
      }
    };
  }
}
