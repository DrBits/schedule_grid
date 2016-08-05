import 'angular';
import * as moment from 'moment';
import * as $ from 'jquery';
import { autobind } from 'core-decorators';
import ScheduleController from '../controllers/schedule-controller';
import { appState, AppState } from '../app-state';
import { doctors } from '../domain/data';
import { ActivityType } from '../domain/activities';
const ngTemplate = require('../templates/schedules.html');

interface ISchedulesScope extends ng.IScope {
  startDat: Date;
  days: number;
  dates: Array<Date>;
  setDays: (number, Date) => void;
  scrollRef: Element;
  scrollPos: number;
  strutHeight: number;
  appState: AppState;
  isEmpty: () => boolean;
  noneSelected: () => boolean;
  noFreeSlots: () => boolean;
}

const today: () => Date = () => moment().startOf('day').toDate();

const OR: (a: boolean, b: boolean) => boolean = (a, b) => a || b;

export default class Schedules implements ng.IDirective {
  scope: ISchedulesScope;
  $scope: ISchedulesScope;
  controller = ScheduleController;

  $timeout: ng.ITimeoutService;
  strutHeight: number = 0;
  wrapper: JQuery;

  public templateUrl = ngTemplate;

  constructor($timeout) {
    this.$timeout = $timeout;
  }

  private setDays: (number, Date) => void = (n, startDay) => {
    this.$scope.days = n;
    this.$scope.dates = Array.apply(null, Array(this.$scope.days))
      .map((_, i) => i)
      .map(i => moment(startDay).add(i, 'days').toDate());

    this.$timeout(() => {
      this.setStrutHeight();
      this.handleScroll();
    });
  };

  @autobind
  private collapseHeader(element: Element, collapse: boolean) {
    if (collapse) {
      element.classList.add('collapsed');
    } else {
      element.classList.remove('collapsed');
    }
  }

  private handleScroll: () => void = () => {
    const refTop = this.wrapper.scrollTop();
    this.$scope.$apply(() => this.$scope.scrollPos = refTop);
    this.wrapper.find('.schedule-header').each((idx, e) => $(e).css({ top: `${refTop}px` }));
  };

  @autobind
  private setStrutHeight() {
    this.scope.strutHeight = (Math.max(...$(document).find('.schedule-header')
        .map((_, e) => e.clientHeight).toArray())) + 20;
  }

  public link(scope: ISchedulesScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
    this.$scope = this.scope = scope;
    this.$scope.setDays = this.setDays;
    this.$scope.appState = appState;
    this.setDays(7, this.$scope.appState.startDate);
    this.wrapper = $(element).find('#wrapper');
    scope.scrollRef = this.wrapper[0];

    this.scope.isEmpty = () => $(element).find('div.schedule').length === 0;

    this.scope.noneSelected = () =>
    doctors.filter(d => d.visible).length === 0;

    this.scope.noFreeSlots = () => {
      return !(
        this.scope.dates.map(
          date =>
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
        ).reduce(OR, false)
      );
    };

    this.$scope.scrollPos = 0;
    this.wrapper.on('scroll', this.handleScroll);

    this.$scope.$watch('days', days =>
      this.$scope.setDays(days, this.$scope.appState.startDate));

    this.$scope.$watch('appState.startDate', newStartDate =>
      this.$scope.setDays(this.$scope.days, this.$scope.appState.startDate));
  }
}
