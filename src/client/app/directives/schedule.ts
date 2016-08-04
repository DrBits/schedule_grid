import 'angular';
import { Doctor } from '../domain/doctor';
import { Activity } from '../domain/activities';
import { doctors } from '../domain/data';
import ScheduleController from '../controllers/schedule-controller';

const ngTemplate = require('../templates/schedule.html') as string;

interface IScheduleScope extends ng.IScope {
  date: Date;
  doctors: Doctor[];
  scheduleGrid: { Moment: Activity }[];
  scrollRef: Element;
  doctorFilter: Doctor[];
  strutHeight: number;
}

export default class Schedule implements ng.IDirective {
  scope = {
    date: '=',
    scrollRef: '=',
    scrollPos: '=',
    doctorFilter: '=',
    strutHeight: '='
  };

  replace = false;
  require = '^schedules';
  controller: ScheduleController;

  public templateUrl = ngTemplate;

  public link(scope: IScheduleScope,
              element: ng.IAugmentedJQuery,
              attrs: ng.IAttributes,
              ctl: ScheduleController) {
    scope.doctors = doctors;
    this.controller = ctl;
  }
}
